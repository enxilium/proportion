import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {       // GET // get name using email as id
    const client = await clientPromise;
    const db = client.db('primary');
    const users = db.collection('users');
    

    let result;
    const requestData = await request.json();
    if (requestData.requestType === 'get_name') {
        result = await users.findOne({ _id: requestData.id });
    }

    else if (requestData.requestType=== 'get_polls') {
        if (requestData.timeFrame === 'last_week') {
            result = await users.findOne({ _id: requestData.id });
        }
        else if (requestData.timeFrame === 'last_month') {
            result = await users.findOne({ _id: requestData.id });
        }
        else if (requestData.timeFrame === 'last_year') {
            result = await users.findOne({ _id: requestData.id });
        }
        else if (requestData.timeFrame === 'all_time') {
            result = await users.findOne({ _id: requestData.id });
        }
    }
    return result;
}


export async function POST(request: Request, ) {    // POST
    const client = await clientPromise;
    const db = client.db('primary');
    const users = db.collection('users');
    
    const userData = await request.json();
    const result = await users.insertOne(userData);     // id is email
    

    return result.acknowledged;
}

export async function addPoll(request: Request) {   // PATCH
    const client = await clientPromise;
    const db = client.db('primary');
    const users = db.collection('users');
    
    const userData = await request.json();
    const result = await users.updateOne({ _id: userData.id }, { $push: { daily_polls: userData.daily_poll }})
    
    return result.acknowledged;
}

export async function deleteUser(request: Request) {    // DELETE
    const client = await clientPromise;
    const db = client.db('primary');
    const users = db.collection('users');
    
    const userData = await request.json();
    const result = await users.deleteOne({ _id: userData.id });
    
    return result.acknowledged;
}
