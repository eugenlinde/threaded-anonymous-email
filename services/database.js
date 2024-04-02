import { createClient } from '@supabase/supabase-js';
import MissingPropertyError from '../errors/missingPropertyError.js';
import DatabaseError from '../errors/databaseError.js';
import dotenv from 'dotenv';
dotenv.config();

export const getRecord = async (parsedData) => {
    if (!parsedData.threadRef || !parsedData.from) {
        throw new MissingPropertyError(
            'Thread reference or from address not received!',
        );
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
    );
    const { data, error } = await supabase
        .from(process.env.MAIN_TABLE)
        .select(
            `id, ${process.env.CLIENT_ONE_TABLE}(email), ${process.env.CLIENT_TWO_TABLE}(email)`,
        )
        .eq('id', parsedData.threadRef);

    if (error) {
        console.error('Error while fetching data: ', error);
        throw new DatabaseError('Error while fetching data');
    }

    return data;
};

export const createRecord = async (client_one_col, client_two_col) => {
    if (!client_one_col || !client_two_col) {
        throw new MissingPropertyError('Missing one or both of the client IDs');
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
    );
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: process.env.SUPABASE_EMAIL,
        password: process.env.SUPABASE_PASSWORD,
    });

    if (loginError) {
        throw new Error('Failed to authenticate');
    }

    const { data, error } = await supabase
        .from(process.env.MAIN_TABLE)
        .insert({
            [process.env.CLIENT_ONE_COLUMN]: client_one_col,
            [process.env.CLIENT_TWO_COLUMN]: client_two_col,
        })
        .select(
            `id, ${process.env.CLIENT_ONE_TABLE}(email), ${process.env.CLIENT_TWO_TABLE}(email)`,
        );

    if (error) {
        console.error('Error while inserting data: ', error);
        throw new DatabaseError('Error while inserting data');
    }

    return data;
};
