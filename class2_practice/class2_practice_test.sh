echo -ne "1. param err <=> \c"
curl -X GET http://localhost:8000/contents
echo -ne "\n2. param err <=> \c"
curl -X GET http://localhost:8000/contents/
echo -ne "\n3. file not exist <=> \c"
curl -X GET http://localhost:8000/contents/kvanfovaebfopvafv
echo -ne "\n4. param err <=> \c"
curl -X GET http://localhost:8000/infos
echo -ne "\n5. param err <=> \c"
curl -X GET http://localhost:8000/infos/
echo -ne "\n6. file not exist <=> \c"
curl -X GET http://localhost:8000/infos/kvanfovaebfopvafv
echo -ne "\n7. param err <=> \c"
curl -X POST http://localhost:8000/contents
echo -ne "\n8. param err <=> \c"
curl -X POST http://localhost:8000/contents/
echo -ne "\n9. GET /abc not found <=> \c"
curl -X GET http://localhost:8000/abc
echo -ne "\n10. POST /infos not found <=> \c"
curl -X POST http://localhost:8000/infos
echo -ne "\n11. done <=> \c"
curl -X POST http://localhost:8000/contents/n2.txt -d '123456'
echo -ne "\n12. 123456 <=> \c"
curl -X GET http://localhost:8000/contents/n2.txt
echo -ne "\n13. similar to {\"createTime\":\"2020-09-18T03:05:18Z\",\"updateTime\":\"2020-09-18T03:46:22Z\"} \c"
curl -X GET http://localhost:8000/infos/n2.txt
echo -ne "\n14. done <=> \c"
curl -X POST http://localhost:8000/contents/n3.txt -d 'abc'
echo -ne "\n15. file not exist <=> \c"
curl -X GET http://localhost:8000/contents/n4.txt
echo -ne "\n16. similar to {\"createTime\":\"2020-09-19T01:29:57Z\",\"updateTime\":\"2020-09-19T01:30:22Z\"}\c"
curl -X GET http://localhost:8000/infos/n6.txt
echo -ne "\n17. data length err <=> \c"
curl -X POST http://localhost:8000/contents/n7.txt
echo -ne "\n18. data length err <=> \c"
curl -X POST http://localhost:8000/contents/n7.txt -d '012345678901234567890'
