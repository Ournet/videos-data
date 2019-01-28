import DynamoDB = require('aws-sdk/clients/dynamodb');
import {
    DynamoItem,
} from 'dynamo-item';

import { DynamoVideo } from './dynamo-video';

export type VideoTableKey = {
    id: string
}

export class VideoModel extends DynamoItem<VideoTableKey, DynamoVideo> {
    constructor(client: DynamoDB.DocumentClient, tableSuffix: string) {
        super({
            hashKey: {
                name: 'id',
                type: 'S'
            },
            name: 'videos',
            tableName: `ournet_videos_${tableSuffix}`,
            indexes: []
        }, client as any);
    }
}
