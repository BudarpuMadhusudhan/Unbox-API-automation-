const reset_body={
    "station_id": "station-1-asbeco"//"all"//station-p6-1
}
const update_parcel_body='{"feedlane_id": "feeder_1","station_id": "replace_station","event_name": "scan_data","attribute": {"scan_data": ["replace_String"],"scan_timestamp": 1726523562},"event_type": "Feeding","trace_id": "c51f4fd1-65b0-471b-b64a-7f4893cbc5ed"}'
const robot_events_botLoaded_body='{"eventName": "botLoaded","publishTimeStamp": 125648554,"bridgeTimeStamp": 12,"LoadStatus": "with-load","state": "string","grid_type": "feeding","event_retry_count": 12,"event_trace_id": "replace_Event_Trace_ID_UUID","load_approval_payload": {},"attributes": {"feederId": "replace_feederID","errorState": "none","parcelId": "replace_parcelID","hardwareId": "VR11","robotTimestamp": 1665730666882,"robotId": "robot_1"}}'
const robot_unload_request_body='{"robot": "robot_1","parcel_id": "replace_parcel","bin_id": "bin_1","bin_name": "replace_binName","dump_type": "normal"}'
const robot_unload_completion_ack_body='{"parcel_id": "replace_parcel","robot": "robot_1","hardware_id": "VR11","bin_name": "replace_binName","bin_id": "bin_id"}'
const update_feeder_status_body='{"station_id": "replace_station","feedlane_id": "replace_feeder","entity_id": "replace_entity_id","entity": "replace_entity","status": true,"request_id": "e796f293-c89e-43be-892f-a421c90681a4"}'
const update_bins_body='{"bin_ids": "replace_bins","bin_state": "replace_binState","trace_id": "4cfd69bd-518a-4677-938b-a2768e7dfa92","updated_by": "Prakhyat"}'
const update_single_binStatus_body='{"bagAbsenceSensor": true,"binId": "replace_binID","binState": "replace_binState","binSuperStatus": "ON","errorDetected": false,"microcontrollerId": "192.168.1.107","parcelStuckSensor": false,"rackId": "192.168.1.107222","segmentId": "B-2","timestamp": "1662635040301"}'
const update_bin_flush_copy='{"binBarcode":"replace_binBarcode","consolidationPacketId":replace_consolidationPacketId,"flushTimeStamp":36456546,"eventTimeStamp":4565464564}'
const manual_putaway='{"scanned_barcode": ["replace_string"],"scan_timestamp": 1,"trace_id": "string"}'
const delink_parcel='{ "parcel_id": "replace_parcelID","scan_timestamp": 191919191919, "bin_id": "replace_binID"}'
const link_parcel='{"parcel_id": "replace_parcelID", "bin_name": "replace_binID", "unload_type": "manual", "putaway_timestamp": 191919191919,  "user_id": "manual"}'
const close_bag='{"trigger_type": "bagging user",   "bin_barcode": "replace_bin_Barcode", "bag_seal_id": "replace_bag_seal_id", "close_time_stamp": 1620229716, "event_time_stamp": 1620229716,  "trace_id": "cc891276-1f16-4eef-ba9d-964119cdf0dd","closed_by": "1620229716"}'
const bag_seal_update='{ "old_bag_seal": "replace_old_bag_seal", "new_bag_seal": "replace_new_bag_seal","bag_seal_change_reason": "Seal Broken While Packing","user_name": "string" }'
const bag_handover='{ "bag_seal_id": "replace_bag_seal_id", "created_by": "string"}'

const PS_robot_events_botLoaded_body='{"eventName": "botLoaded", "publishTimeStamp": 125648555,"LoadStatus": "with-load","state": "loading", "grid_type": "feeding","event_trace_id" : "cfe610d-678e-4494-90c9-fb4d15919","event_retry_count":"0","attributes": {  "feederId": "feeder_1", "errorState": "none", "parcelId": "0cfe610d-678e-4494-90c9-fb4d15919078", "hardwareId": "VR11", "robotTimestamp": 1665730676882, "robotId": "robot_1" }}'
const PS_SP_dummy_robotevent='{"eventName": "botLoaded","publishTimeStamp": 125648554,"bridgeTimeStamp": 12,"LoadStatus": "with-load","state": "string","grid_type": "feeding","event_retry_count": 12,"event_trace_id": "replace_event_trace_id","load_approval_payload": {}, "attributes": {"feederId": "feeder_1",  "errorState": "none","parcelId": "none","hardwareId": "VR11","robotTimestamp": 1665730666882,"robotId": "robot_1"  } }'
const PS_update_parcel_body='{"feedlane_id": "feeder_1","station_id": "replace_station","event_name": "scan_data","attribute": {"scan_data": ["replace_String"],"scan_timestamp": 1726523562},"event_type": "Feeding","trace_id": "replace_traceID"}'
const PS_SP_Liverun_update_parcel_body='{"feedlane_id": "feeder_1","station_id": "replace_station","event_name": "scan_data","attribute": {"scan_data": ["replace_String"],"scan_timestamp": 1726523562},"event_type": "Feeding","trace_id": "c51f4fd1-65b0-471b-b64a-7f4893cbc5ed"}'

exports.PS_SP_dummy_robotevent=PS_SP_dummy_robotevent
exports.PS_robot_events_botLoaded_body=PS_robot_events_botLoaded_body;
exports.PS_update_parcel_body=PS_update_parcel_body
exports.PS_SP_Liverun_update_parcel_body=PS_SP_Liverun_update_parcel_body

exports.reset_body=reset_body;
exports.update_parcel_body=update_parcel_body;
exports.robot_events_botLoaded_body=robot_events_botLoaded_body;
exports.robot_unload_request_body=robot_unload_request_body;
exports.robot_unload_completion_ack_body=robot_unload_completion_ack_body;
exports.update_feeder_status_body=update_feeder_status_body;
exports.update_bins_body=update_bins_body;
exports.update_single_binStatus_body=update_single_binStatus_body;
exports.update_bin_flush_copy=update_bin_flush_copy
exports.manual_putaway=manual_putaway
exports.delink_parcel=delink_parcel
exports.link_parcel=link_parcel
exports.close_bag=close_bag
exports.bag_seal_update=bag_seal_update
exports.bag_handover=bag_handover