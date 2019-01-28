#!/bin/bash

yarn unlink @ournet/domain
yarn unlink @ournet/videos-domain
yarn unlink dynamo-item

yarn add @ournet/domain
yarn add @ournet/videos-domain
yarn add dynamo-item

yarn test
