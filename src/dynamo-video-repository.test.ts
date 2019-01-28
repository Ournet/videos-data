
import test from 'ava';
import { launch, stop } from 'dynamodb-local';
import DynamoDB = require('aws-sdk/clients/dynamodb');
import { DynamoVideoRepository } from './dynamo-video-repository';
import { VideoRepository, Video, VideoHelper } from '@ournet/videos-domain';

test.before('start dynamo', async t => {
    await t.notThrows(launch(8000, null, ['-inMemory', '-sharedDb']));
})

test.after('top dynamo', async t => {
    t.notThrows(() => stop(8000));
})

const client = new DynamoDB.DocumentClient({
    region: "eu-central-1",
    endpoint: "http://localhost:8000",
    accessKeyId: 'ID',
    secretAccessKey: 'Key',
});

const repository: VideoRepository = new DynamoVideoRepository(client, 'test');

test.skip('throw no table', async t => {
    await t.throws(repository.exists('id1'), /non-existent table/);
})

test.beforeEach('createStorage', async t => {
    await t.notThrows(repository.createStorage());
})

test.afterEach('deleteStorage', async t => {
    await t.notThrows(repository.deleteStorage());
})

test.serial('#create', async t => {
    const initialVideo: Video = VideoHelper.build({
        sourceId: 'aa',
        sourceType: 'YOUTUBE',
        websites: ['site'],
    });

    const createdVideo = await repository.create(initialVideo);
    t.is(createdVideo.id, initialVideo.id);
    t.deepEqual(createdVideo, initialVideo);

    await t.throws(repository.create(initialVideo), /The conditional request failed/);
})

test.serial('#update', async t => {
    const initialVideo: Video = VideoHelper.build({
        sourceId: 'aa',
        sourceType: 'YOUTUBE',
        websites: ['site'],
    });

    const createdVideo = await repository.create(initialVideo);
    t.deepEqual(createdVideo, initialVideo);

    await t.throws(repository.update({ id: initialVideo.id.replace(/[a]/g, 'b'), set: {} }), /The conditional request failed/);
    await t.throws(repository.update({ id: initialVideo.id }), /"value" must contain at least one of \[set, delete\]/);
    await t.throws(repository.update({ id: initialVideo.id, set: { sourceId: 'ru' } }), /"sourceId" is not allowed/);
    await t.throws(repository.update({ id: initialVideo.id, set: { sourceType: 'URL' } }), /"sourceType" is not allowed/);
    await t.throws(repository.update({ id: initialVideo.id, set: { createdAt: 'new text' } }), /"createdAt" is not allowed/);

    const updatedVideo = await repository.update({
        id: initialVideo.id,
        set: {
            countViews: 1,
        }
    });

    t.is(updatedVideo.countViews, 1);
})
