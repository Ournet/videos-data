import { Video } from "@ournet/videos-domain";

export interface DynamoVideo extends Video {

}

export class VideoMapper {
    static mapFromDomain(item: Video): DynamoVideo {
        const data = item as DynamoVideo;

        return data;
    }

    static mapToDomain(item: DynamoVideo): Video {
        const data = item as Video;

        return data;
    }

    static mapFromPartialDomain(item: Partial<Video>): Partial<DynamoVideo> {
        const data = item as Partial<DynamoVideo>;

        return data;
    }
}
