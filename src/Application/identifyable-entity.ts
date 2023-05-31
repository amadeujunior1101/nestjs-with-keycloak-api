import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class IIdentifyableEntity {
  @PrimaryColumn()
  id: string;
}
