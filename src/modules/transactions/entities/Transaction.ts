import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../../users/entities/User";

enum TransactionType{
  income = 'income',
  outcome = 'outcome',
}
@Entity()
class Transaction {
  @PrimaryColumn()
  id: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType})
  type: TransactionType

  @ManyToOne(() => User, user => user.transaction)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => User, user => user.transaction)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @CreateDateColumn()
  created_at: Date

}

export default Transaction;
