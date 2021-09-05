import {Request, Response} from 'express';
import { container } from 'tsyringe';
import CreateTransfer from './CreateTransfer.service';

enum OperationType {
  TRANSFER = 'transfer',
}

class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response>{
    const { id: userId } = request.user
    const { senderId } = request.params
    const { amount, description } = request.body

    const type = 'transfer' as OperationType;

    const createTransfer = container.resolve(CreateTransfer)

    const transfer = await createTransfer.execute(userId, senderId, amount, description, type)

    return response.json(transfer);
  }
}

export default CreateTransferController
