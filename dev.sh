#!/bin/bash

yarn remove @ournet/domain
yarn remove @ournet/videos-domain
yarn remove dynamo-item

yarn link @ournet/domain
yarn link @ournet/videos-domain
yarn link dynamo-item

yarn test
