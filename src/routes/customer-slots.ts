import { Request, Response } from "express"
import { Slot, slotSchema } from "../models/slot"
import { findSlotByConversationId, createRecord, updateRecord, slotTableName } from "../utils/helper-airtable"

/**
 * @api {post} vi/customer/slots 
 * @apiDescription update the slots by conversation_id
 * @apiName customerSlots
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 *     ...Slot,
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     recordId: string,
 *     updated?: boolean,
 *     created?: boolean
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   statusCode: duplicated-conversation_id
 * }
 */
export const customerSlots = async (req: Request, res: Response) => {
    // validate data
    await slotSchema.validateAsync(req.body)
    const conversation_id = req.body.conversation_id;

    const recordId = await findSlotByConversationId(conversation_id)

    if (recordId) {
        // just updation proven for now
        const updateDummyData = {
            ...req.body
        }
        const updatedRecord = await updateRecord<Slot>(
            slotTableName,
            recordId,
            updateDummyData
        )

        res.status(200).json({ recordId: updatedRecord.conversation_id, updated: true })
        return
    }

    const createdRecordId = await createRecord<Slot>(slotTableName, req.body)
    res.status(200).json({ recordId: createdRecordId.conversation_id, created: true })
}
