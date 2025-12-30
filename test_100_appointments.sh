#!/bin/bash
for i in {1..101}
do
  curl -X POST http://localhost:8080/api/appointments \
    -H "Content-Type: application/json" \
    -d '{
      "doctorId": 4,
      "appointmentDate": "2025-12-27",
      "appointmentTime": "09:00:00",
      "reason": "Test appointment '$i'",
      "serviceIds": [1],
      "fullname": "Test Patient '$i'",
      "email": "test'$i'@test.com",
      "phone": "090123456'$i'"
    }'
  echo "Created appointment $i"
done