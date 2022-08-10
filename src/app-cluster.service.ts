import cluster from 'cluster';
import * as os from 'os';

import {
  Injectable,
  Logger,
} from '@nestjs/common';

const numCPUs = 1; // os.cpus().length

@Injectable()
export class AppClusterService {
  public static logger = new Logger(
    AppClusterService.name,
  );
  static clusterize(callback: Function) {
    if (cluster.isPrimary) {
      AppClusterService.logger.log(
        `Master ${process.pid} is running`,
      );
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on(
        'exit',
        (worker, code, signal) => {
          AppClusterService.logger.error(
            `worker ${worker.process.pid} died`,
          );
          cluster.fork();
        },
      );
    } else {
      AppClusterService.logger.log(
        `Worker ${process.pid} started`,
      );
      callback();
    }
  }
}
