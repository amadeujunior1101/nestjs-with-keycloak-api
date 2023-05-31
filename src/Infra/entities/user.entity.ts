import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  constructor(props: UserModel) {
    Object.assign(this, props);
  }
}
