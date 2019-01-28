
import { VideoRepository } from '@ournet/videos-domain';
import { DynamoVideoRepository } from './dynamo-video-repository';


export class VideoRepositoryBuilder {
    static build(client: any, tableSuffix: string = 'v0'): VideoRepository {
        return new DynamoVideoRepository(client, tableSuffix);
    }
}
