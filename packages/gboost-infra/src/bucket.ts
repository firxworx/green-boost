import { Duration } from "aws-cdk-lib";
import {
  BlockPublicAccess,
  Bucket as CdkBucket,
  BucketEncryption,
  BucketProps as CdkBucketProps,
  StorageClass,
} from "aws-cdk-lib/aws-s3";
import { NagSuppressions } from "cdk-nag";
import type { Construct } from "constructs";

interface BucketProps extends CdkBucketProps {
  stage: string;
  disableServerAccessLogsBucket?: boolean;
}

export class Bucket extends CdkBucket {
  constructor(scope: Construct, id: string, props: BucketProps) {
    const { ...newProps } = props;
    if (newProps.encryption === undefined) {
      newProps.encryption = BucketEncryption.S3_MANAGED;
    }
    if (newProps.enforceSSL === undefined) {
      newProps.enforceSSL = true;
    }
    if (newProps.publicReadAccess === undefined) {
      newProps.publicReadAccess = false;
    }
    if (newProps.blockPublicAccess === undefined) {
      newProps.blockPublicAccess = BlockPublicAccess.BLOCK_ALL;
    }
    if (
      !newProps.disableServerAccessLogsBucket &&
      !newProps.serverAccessLogsBucket
    ) {
      const serverAccessLogsBucket = new CdkBucket(
        scope,
        "ServerAccessLogsBucket",
        {
          blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
          enforceSSL: true,
          encryption: BucketEncryption.S3_MANAGED,
          lifecycleRules: [
            {
              transitions: [
                {
                  storageClass: StorageClass.INTELLIGENT_TIERING,
                  transitionAfter: Duration.days(0),
                },
              ],
            },
          ],
          publicReadAccess: false,
        }
      );
      NagSuppressions.addResourceSuppressions(serverAccessLogsBucket, [
        {
          id: "AwsSolutions-S1",
          reason:
            "Server Access Logs Bucket doesn't need a Server Access Logs Bucket",
        },
      ]);
      newProps.serverAccessLogsBucket = serverAccessLogsBucket;
    }
    super(scope, id, newProps);
  }
}
