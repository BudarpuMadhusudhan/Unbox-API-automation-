const insertShipment='{"status":{"statusCode": 734,"statusMessage": "Hii","statusType": "SUCCESS","totalCount": 1  },  "data":[{"consolidationPacketId": replace_consolidationId,"consolidationGroupKey": "customerId_addressID","consolidationPacketStatus": "replace_ConsolidationPacketStatus","consolidationType": "some_string","sectionId": 13,"section_name":replace_sectionname,"checkin_property_group_id": "some_string","eventTime": 5245425,"pickedItems": [{"packetItemId":replace_PacketItemID,"itemBarcode": "replace_itemBarcode","itemId": "dfg","skuCode": "dfg","skuId": replace_skuID,"articleTypeId": "11","articleTypeName": "dgd","itemStatus": "replace_itemStatus","orderReleaseStatus": "dfsd","pickingTime": 35653456}],"packetSkus":[{"skuId": replace_SKU,"articleTypeId": 12,"articleTypeName": "fghfh","quantity": 1}]}]}'
exports.insertShipment=insertShipment;

const insertShipmentLatest='{"status": {"statusCode": 200,"statusMessage": "replace_StatusMessage"},"data": [{"consolidationPacketId": "replace_ConsolidationPacketID","consolidationGroupKey": "65103c93.452f.4a50.8ad2.1593bad69b8aHgGWVHC5qh_379379816:4","consolidationPacketStatus": "replace_ConsolidationPacketStatus","sectionId": "replace_sectionId","eventTime":1234567890,"sectionName":"AZ 06","pickedItems":[{"packetItemId":"replace_packetItemId","itemBarcode": "replace_itemBarcode","skuCode": "DSBYHDBG31151153","skuId": "replace_skuID","articleTypeId": "11","articleTypeName": "Jeans","itemStatus": "replace_itemStatus","pickingTime": 35653456}],"packetSkus": [{"skuId": "replace_PacketSKUID","articleTypeId": 11,"articleTypeName": "Jeans","quantity": 1}]}]}'
exports.insertShipmentLatest=insertShipmentLatest;

const singleItemShipmentPayload='{"status": {"statusCode": 10110,"statusMessage": "Consolidation not needed for item: 101676233824. Reason: PACK DESK - MW","statusType": "ERROR"},"data": [{"itemBarcode": "replace_itemBarcode","eventTime": 1694142865}]}'
exports.singleItemShipmentPayload=singleItemShipmentPayload;

        
const pay='{ "data": [{ "itemBarcode":"replacement_ItemBarcode", "binBarcode":"replace_BinBarcode", "consolidationPacketId": "replace_ConsolidationPacketId", "traceId": "replace_traceId" }  ],"status": {"statusCode": 776788,"statusMessage": "Sucess"  }  }'
 exports.pay=pay       
   
      
       
       
       
       
     
  
    
      
      
  

  
       
     
   
   
     
  
   
