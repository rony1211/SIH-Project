import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Using the mock dataset
const dataPath = path.join(process.cwd(), 'data', 'fieldTasks.json');

// In-memory store to simulate real-time updates and offline syncs
let memoryTasks: any[] | null = null;

function getTasks() {
  if (!memoryTasks) {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    memoryTasks = JSON.parse(fileContents);
  }
  return memoryTasks || [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const officerId = searchParams.get('officerId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let tasks = getTasks();

    if (officerId) {
      tasks = tasks.filter(t => t.officerId === officerId);
    }
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (type) {
      tasks = tasks.filter(t => t.type === type);
    }

    // Sort by priority (Urgent > High > Medium > Low)
    const priorityWeight: Record<string, number> = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    tasks.sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch field tasks' }, { status: 500 });
  }
}

// POST endpoint to handle "offline sync" or task updates
export async function POST(request: Request) {
  try {
    const { tasks: updatedTasks } = await request.json();
    if (!Array.isArray(updatedTasks)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    let tasks = getTasks();

    // Merge updates
    updatedTasks.forEach(updated => {
      const idx = tasks.findIndex(t => t.id === updated.id);
      if (idx !== -1) {
        tasks[idx] = { ...tasks[idx], ...updated, status: 'Completed' };
      }
    });

    memoryTasks = tasks;

    return NextResponse.json({ 
      success: true, 
      message: `${updatedTasks.length} tasks synced successfully`,
      data: tasks
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to sync tasks' }, { status: 500 });
  }
}
