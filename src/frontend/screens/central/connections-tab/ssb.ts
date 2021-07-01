/* Copyright (C) 2018-2021 The Manyverse Authors.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import xs, {Stream} from 'xstream';
import {Req} from '../../../drivers/ssb';
import {StagedPeerKV} from '../../../ssb/types';

export type Actions = {
  bluetoothSearch$: Stream<any>;
  connectPeer$: Stream<StagedPeerKV>;
  disconnectPeer$: Stream<string>;
  disconnectForgetPeer$: Stream<string>;
  forgetPeer$: Stream<string>;
  pingConnectivityModes$: Stream<any>;
};

export default function ssb(actions: Actions) {
  return xs.merge(
    actions.connectPeer$.map(
      (peer) =>
        ({
          type: 'conn.connect',
          address: peer[0],
          hubData: {type: peer[1].type},
        } as Req),
    ),
    actions.disconnectPeer$.map(
      (address) => ({type: 'conn.disconnect', address} as Req),
    ),
    actions.disconnectForgetPeer$.map(
      (address) => ({type: 'conn.disconnectForget', address} as Req),
    ),
    actions.forgetPeer$.map(
      (address) => ({type: 'conn.forget', address} as Req),
    ),
    actions.bluetoothSearch$.mapTo({
      type: 'bluetooth.search',
      interval: 20e3,
    } as Req),
  );
}
