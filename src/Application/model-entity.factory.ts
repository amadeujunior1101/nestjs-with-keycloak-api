import { IIdentifyableEntity } from './identifyable-entity';

export interface IModelEntityFactory<
  TEntity,
  TModel extends IIdentifyableEntity,
> {
  toModel(
    entity: TEntity,
    id?: string,
    relation?: Record<symbol | string | number, unknown>,
  ): TModel;
  toEntity(model: TModel): TEntity;
}
