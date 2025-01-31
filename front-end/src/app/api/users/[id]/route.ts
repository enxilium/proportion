import { NextResponse } from 'next/server';
import { Condition, ObjectId } from 'mongodb';
import client, { connectToDatabase } from '@/lib/mongodb';
import { NextRequest } from 'next/server';
import { UpdateFilter, Document } from 'mongodb';


export async function GET(request: NextRequest) {       // GET // get name using email as id
    await connectToDatabase();
    const db = client.db('primary');
    const users = db.collection('users');
    
    const searchParams = request.nextUrl.searchParams;
    const requestType = searchParams.get('requestType');
    const id = searchParams.get('id');
    const timeFrame = searchParams.get('timeFrame');
    
    if (!id || !requestType) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let result;
    if (requestType === 'get_name') {
        result = await users.findOne({ id: id }, { projection: { name: 1, _id: 0 } });
    }
    else if (requestType === 'get_polls') {
        if (timeFrame === 'last_week') {
            result = await users.findOne({ id: id }, { projection: { polls: 1, _id: 0 } });
        }
        else if (timeFrame === 'last_month') {
            result = await users.findOne({ id: id }, { projection: { polls: 1, _id: 0 } });
        }
        else if (timeFrame === 'last_year') {
            result = await users.findOne({ id: id }, { projection: { polls: 1, _id: 0 } });
        }
        else if (timeFrame === 'all_time') {
            result = await users.findOne({ id: id }, { projection: { polls: 1, _id: 0 } });
        }
    }
    else if (requestType === 'check_latest_poll') {
        const currentDate = new Date().toISOString().split('T')[0];
        result = await users.findOne({ id: id, "polls.date": currentDate }, { projection: { "polls.$": 1, _id: 0 } });
    }
    else if (requestType === 'get_milestones') {
        result = await users.findOne({ id: id }, { projection: { milestones: 1, _id: 0 } });
    }
    else if (requestType === 'get_journals') {
        result = await users.findOne({ id: id }, { projection: { journals: 1, _id: 0 } });
    }
    return NextResponse.json(result);
}

export async function POST(request: Request) {    // add user
    await connectToDatabase();
    const db = client.db('primary');
    const users = db.collection('users');
    
    const requestData = await request.json();
    const result = await users.insertOne(requestData);     // id is email
    

    return NextResponse.json({ acknowledged: result.acknowledged });
}

export async function PATCH(request: Request) {   // add poll, modify poll, add milestone
    await connectToDatabase();
    const db = client.db('primary');
    const users = db.collection('users');
    
    const requestData = await request.json();
    let result;
    if (requestData.requestType === 'add_poll') {
        result = await users.updateOne({ id: requestData.id }, { $push: { polls: requestData.poll }})
    }
    else if (requestData.requestType === 'modify_poll') {
        result = await users.updateOne(
            { id: requestData.id, "polls.date": requestData.poll.date },
            { $set: { "polls.$": requestData.poll } }
        );
    }
    else if (requestData.requestType === 'add_milestone') {
        result = await users.updateOne({ id: requestData.id }, { $push: { milestones: requestData.milestone }})
    }
    else if (requestData.requestType === 'delete_milestone') {
        result = await users.updateOne(
            { id: requestData.id },
            { $pull: { milestones: { title: requestData.title } } } as unknown as UpdateFilter<Document>
        );
    }
    else if (requestData.requestType === 'add_journal') {
        result = await users.updateOne({ id: requestData.id }, { $push: { journals: requestData.journal }})
    }
    else {
        result = { acknowledged: false };
    }

    return NextResponse.json({ acknowledged: result.acknowledged });
}

export async function DELETE(request: Request) {    // delete user
    await connectToDatabase();
    const db = client.db('primary');
    const users = db.collection('users');
    
    const userData = await request.json();
    const result = await users.deleteOne({ id: userData.id });
    
    return NextResponse.json({ acknowledged: result.acknowledged });
}