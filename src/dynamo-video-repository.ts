
// const debug = require('debug')('ournet:videos-data');

import DynamoDB = require('aws-sdk/clients/dynamodb');
import {
    BaseRepository,
    RepositoryUpdateData,
    RepositoryAccessOptions,
} from '@ournet/domain';

import {
    Video,
    VideoRepository,
    VideoValidator,
} from '@ournet/videos-domain';

import { VideoModel } from './video-model';
import { VideoMapper } from './dynamo-video';
import { sortEntitiesByIds } from './helpers';

export class DynamoVideoRepository extends BaseRepository<Video> implements VideoRepository {
    protected model: VideoModel

    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super(new VideoValidator());
        this.model = new VideoModel(client, tableSuffix);
    }

    async innerCreate(data: Video) {
        const createdItem = await this.model.create(VideoMapper.mapFromDomain(data));

        const item = VideoMapper.mapToDomain(createdItem);

        return item;
    }

    async innerUpdate(data: RepositoryUpdateData<Video>) {
        const updatedItem = await this.model.update({
            remove: data.delete,
            key: { id: data.id },
            set: data.set && VideoMapper.mapFromPartialDomain(data.set)
        });

        const item = VideoMapper.mapToDomain(updatedItem);

        return item;
    }

    async delete(id: string) {
        const oldItem = await this.model.delete({ id });
        return !!oldItem;
    }

    async exists(id: string) {
        const item = await this.getById(id, { fields: ['id'] });

        return !!item;
    }

    async getById(id: string, options?: RepositoryAccessOptions<Video>) {
        const item = await this.model.get({ id }, options && { attributes: options.fields });

        if (!item) {
            return item;
        }

        return VideoMapper.mapToDomain(item);
    }

    async getByIds(ids: string[], options?: RepositoryAccessOptions<Video>) {
        const items = await this.model.getItems(ids.map(id => ({ id })), options && { attributes: options.fields });

        const list = items.map(item => VideoMapper.mapToDomain(item));

        return sortEntitiesByIds(ids, list);
    }

    async deleteStorage(): Promise<void> {
        await Promise.all([
            this.model.deleteTable(),
        ]);
    }
    async createStorage(): Promise<void> {
        await Promise.all([
            this.model.createTable(),
        ]);
    }
}
