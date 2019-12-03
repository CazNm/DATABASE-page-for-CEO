# DATABASE-page-for-CEO

#페이지 사용을 위해서 mysql설치 후 main.js에서 본인 데이터 베이스 계정에 맞춰서 정보 입력
#데이터 베이스 접근 불가 시 보안 설정 때문이므로 mysql 데이터 베이스에서
#ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>';로 권한 변경 
#이제 npm install 로 express 설치 후, node main.js 실행시에 모듈이 없을 경우 오류 발생함.
#오류가 안뜰 때 까지 npm instal '없는 모듈'설치 끝나면 실행가능
#페이지 접근전에 mysql에 database_sql파일 안에 있는 sql 구문 전부 적용시킨 뒤에 node main.js를 실행하면 페이지 로그인기능 부터  데이터 확인 기능 사용가능
#현재는 결산 부분만 확인 가능
#항목별로 정렬 기능 추가 에정(시설물 데이터베이스 업데이트 후에)
