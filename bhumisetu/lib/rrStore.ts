import initialFamilies from '@/data/families.json';

export interface EntitlementDetail {
  status: 'Allotted' | 'Delivered' | 'Paid' | 'In Progress' | 'Active' | 'Pending' | 'Not Applicable';
  details: string;
  value: string;
  completedDate?: string | null;
}

export interface BankDetails {
  accountNo: string;
  ifsc: string;
  bankName: string;
  dbtVerified: boolean;
}

export interface ColonyDetails {
  name: string;
  amenitiesReady: string[];
  possessionHandedOver: boolean;
}

export interface FamilyRecord {
  id: string;
  headOfFamily: string;
  aadhaarMasked: string;
  familyMembers: number;
  projectId: string;
  projectName: string;
  village: string;
  district: string;
  state: string;
  category: 'Physically Displaced' | 'Economically Affected';
  vulnerability: string;
  bankDetails: BankDetails;
  entitlements: {
    housing: EntitlementDetail;
    employment: EntitlementDetail;
    annuity: EntitlementDetail;
    transportationAllowance: EntitlementDetail;
    resettlementGrant: EntitlementDetail;
    cattleShedGrant: EntitlementDetail;
  };
  colonyDetails: ColonyDetails;
  overallProgress: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __rrFamiliesStore: FamilyRecord[] | undefined;
}

if (!globalThis.__rrFamiliesStore) {
  globalThis.__rrFamiliesStore = JSON.parse(JSON.stringify(initialFamilies)) as FamilyRecord[];
}

export function getAllFamilies(): FamilyRecord[] {
  return globalThis.__rrFamiliesStore || [];
}

export function getFamilyById(id: string): FamilyRecord | undefined {
  const store = globalThis.__rrFamiliesStore || [];
  return store.find((f) => f.id.toLowerCase() === id.trim().toLowerCase());
}

export function updateFamilyEntitlement(
  familyId: string,
  entitlementKey: keyof FamilyRecord['entitlements'],
  status: EntitlementDetail['status'],
  note?: string
): FamilyRecord | null {
  const store = globalThis.__rrFamiliesStore || [];
  const family = store.find((f) => f.id.toLowerCase() === familyId.trim().toLowerCase());
  if (!family) return null;

  if (family.entitlements[entitlementKey]) {
    family.entitlements[entitlementKey].status = status;
    family.entitlements[entitlementKey].completedDate = new Date().toISOString().slice(0, 10);
    if (note) {
      family.entitlements[entitlementKey].details = note;
    }
  }

  // Recalculate progress
  const keys: (keyof FamilyRecord['entitlements'])[] = [
    'housing',
    'employment',
    'annuity',
    'transportationAllowance',
    'resettlementGrant',
    'cattleShedGrant',
  ];
  let applicableCount = 0;
  let fulfilledCount = 0;

  for (const k of keys) {
    const e = family.entitlements[k];
    if (e.status !== 'Not Applicable') {
      applicableCount++;
      if (['Allotted', 'Delivered', 'Paid', 'Active'].includes(e.status)) {
        fulfilledCount++;
      } else if (e.status === 'In Progress') {
        fulfilledCount += 0.5;
      }
    }
  }

  family.overallProgress = applicableCount > 0 ? Math.round((fulfilledCount / applicableCount) * 100) : 100;
  return family;
}

export function getRRStats() {
  const all = getAllFamilies();
  const total = all.length;
  const displaced = all.filter((f) => f.category === 'Physically Displaced').length;
  const affected = all.filter((f) => f.category === 'Economically Affected').length;

  const housingEligible = all.filter((f) => f.entitlements.housing.status !== 'Not Applicable');
  const housingAllotted = housingEligible.filter((f) => ['Allotted', 'Delivered'].includes(f.entitlements.housing.status)).length;
  const housingPercent = housingEligible.length > 0 ? Math.round((housingAllotted / housingEligible.length) * 100) : 100;

  const jobEligible = all.filter((f) => f.entitlements.employment.status !== 'Not Applicable');
  const jobDelivered = jobEligible.filter((f) => ['Delivered', 'Paid'].includes(f.entitlements.employment.status)).length;
  const jobPercent = jobEligible.length > 0 ? Math.round((jobDelivered / jobEligible.length) * 100) : 100;

  const vulnerableCount = all.filter((f) => f.vulnerability.includes('SC') || f.vulnerability.includes('ST') || f.vulnerability.includes('BPL') || f.vulnerability.includes('Widow')).length;

  const avgProgress = Math.round(all.reduce((sum, f) => sum + f.overallProgress, 0) / Math.max(1, total));

  // Estimated total DBT disbursed in Crores
  // ₹5 Lakhs for job grants, ₹50k shifting, ₹36k resettlement, ₹25k cattle shed, ₹3k/mo annuity
  const totalDbtCr = (
    all.reduce((sum, f) => {
      let famSum = 0;
      if (['Paid', 'Delivered'].includes(f.entitlements.employment.status)) famSum += 500000;
      if (f.entitlements.transportationAllowance.status === 'Paid') famSum += 50000;
      if (f.entitlements.resettlementGrant.status === 'Paid') famSum += 36000;
      if (f.entitlements.cattleShedGrant.status === 'Paid') famSum += 25000;
      if (f.entitlements.annuity.status === 'Active' || f.entitlements.annuity.status === 'Delivered') famSum += 36000;
      return sum + famSum;
    }, 0) / 10000000
  ).toFixed(2);

  return {
    total,
    displaced,
    affected,
    housingAllotted,
    housingEligible: housingEligible.length,
    housingPercent,
    jobDelivered,
    jobEligible: jobEligible.length,
    jobPercent,
    vulnerableCount,
    avgProgress,
    totalDbtCr: Number(totalDbtCr),
  };
}
