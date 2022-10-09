import Airtable = require("airtable");
import { AirtableBase } from "airtable/lib/airtable_base";
import { Partner } from "../models/partner";
import { User } from "../models/user";
import { RouteError } from "./route-error";

export let airtableBase: AirtableBase

export const slotTableName = 'test_app_dev'
export const insurancePolicyDetailsTableName = 'insurance_policy_details'
export const partnerTableName = 'partners'
export const userTableName = 'users'

export const initAirtable = () => {
    const { API_TOKEN, AIRTABLE_BASE_ID } = process.env

    if (!API_TOKEN || !AIRTABLE_BASE_ID) {
        throw 'Missing env related to Airtable'
    }

    airtableBase = new Airtable({ apiKey: API_TOKEN }).base(AIRTABLE_BASE_ID);
}

export const createRecord = async <T,>(tableName: string, data: Partial<T>): Promise<T> =>
    new Promise((
        resolve: (val: T) => void,
        reject: (val: Airtable.Error) => void
    ) => {
        airtableBase(tableName).create(
            [
                {
                    "fields": data as unknown as Partial<Airtable.FieldSet>
                }
            ],
            (err, records) => {
                if (err) {
                    return reject(err)
                }

                records.forEach(record => {
                    console.log(`Created Record : `, record.getId());
                });

                resolve(records[0].fields as unknown as T)
            })
    })

export const updateRecord = async<T,>(tableName: string, recordId: string, data: Partial<Airtable.FieldSet>): Promise<T> =>
    new Promise((
        resolve: (val: T) => void,
        reject: (val: Airtable.Error) => void
    ) => {
        airtableBase(tableName).update(
            [
                {
                    "id": recordId,
                    "fields": data
                },
            ],
            (err, records) => {
                if (err) {
                    return reject(err)
                }

                records.forEach(record => {
                    console.log('Updated Record: ', record.id);
                });

                resolve(records[0].fields as unknown as T)
            });
    })

export const removeRecords = (tableName: string, recordIds: string[]): Promise<string[]> =>
    new Promise((
        resolve: (val: string[]) => void,
        reject: (val: Airtable.Error) => void
    ) => {
        let result: string[] = []
        airtableBase(tableName).destroy(
            [
                ...recordIds
            ],
            (err, deletedRecords) => {
                if (err) {
                    return reject(err)
                }

                deletedRecords.forEach(record => {
                    console.log('Deleted record: ', record.id);
                    result.push(record.id)
                });

                resolve(result)
            });
    })

export const fetchRecordById = async <T,>(tableName: string, recordId: string): Promise<T> =>
    new Promise((
        resolve: (val: T) => void,
        reject: (val: Airtable.Error) => void
    ) => {
        airtableBase(tableName).find(
            recordId,
            (err, record) => {
                if (err) {
                    return reject(err)
                }

                resolve(record.fields as unknown as T)
            })
    })

export const fetchRecords = async <T,>(tableName: string, filterByFormula: string = ""): Promise<T[]> =>
    new Promise((
        resolve: (val: T[]) => void,
        reject: (val: Airtable.Error) => void
    ) => {
        let results: T[] = []
        let fetchPayload = {
            view: "Grid view"
        }

        if(filterByFormula !== "") {
            fetchPayload["filterByFormula"] = filterByFormula
        }

        airtableBase(tableName).select(fetchPayload)
            .eachPage(
                (records, fetchNextPage) => {
                    records.forEach(record => {
                        results.push(record.fields as unknown as T)
                    });

                    fetchNextPage();
                },
                (err) => {
                    if (err) {
                        console.log(err)
                        // return reject(err)
                    }

                    resolve(results)
                }
            );
    })

// Error: If length of records is more than 1, throw error 
export const findSlotByConversationId = async (conversation_id: string): Promise<string> => {
    const res = await new Promise((
        resolve: (val: string[]) => void,
        reject: (val: Airtable.Error) => void
    ) => {
        let recordIds: string[] = []

        airtableBase(slotTableName).select({
            // filter by conversation_id
            filterByFormula: `conversation_id = "${conversation_id}"`,
            // Selecting the matched 2 records in Grid view:
            maxRecords: 2,
            view: "Grid view",
            sort: [{ field: "conversation_id", direction: "desc" }],
        }).eachPage(
            (records, fetchNextPage) => {
                records.forEach(record => {
                    recordIds.push(record.id)
                })

                fetchNextPage()
            },
            // done callback function with error parameter
            (err) => {
                if (err) {
                    return reject(err)
                }

                resolve(recordIds)
            }
        )
    })

    if (res.length > 1) {
        throw new RouteError('duplicated-conversation_id', '2+ duplicated conversation exists')
    }

    return res[0]
}

export const findPartnerByUrl = (url: string): Promise<Partner> => new Promise((
    resolve: (val: Partner) => void,
    reject: (val: Airtable.Error) => void
) => {
    let result: Partner

    airtableBase(partnerTableName).select({
        filterByFormula: `url = "${url}"`,
        maxRecords: 1,
        view: "Grid view",
    }).eachPage(
        (records, fetchNextPage) => {
            records.forEach(record => {
                result = record.fields as unknown as Partner
            })

            fetchNextPage()
        },
        // done callback function with error parameter
        (err) => {
            if (err) {
                return reject(err)
            }

            resolve(result)
        }
    )
})

export const fetchUserByEmail = (email: string): Promise<User> => new Promise((
    resolve: (val: User) => void,
    reject: (val: Airtable.Error) => void
) => {
    let result: User

    airtableBase(userTableName).select({
        filterByFormula: `email = "${email}"`,
        maxRecords: 1,
        view: "Grid view",
    }).eachPage(
        (records, fetchNextPage) => {
            records.forEach(record => {
                result = record.fields as unknown as User
            })

            fetchNextPage()
        },
        // done callback function with error parameter
        (err) => {
            if (err) {
                return reject(err)
            }

            resolve(result)
        }
    )
})
