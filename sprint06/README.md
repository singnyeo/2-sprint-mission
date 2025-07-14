## 🌖 SPRINT MISSION 6 ( 25 / 07 / 14 수정 )  
> **NB 2기 강시연**

## 미션 개요

이번 미션은 실제 프로젝트와는 별개로 **SQL 기본 문법**을 직접 연습해보는 실습입니다.  
ORM 없이 SQL을 직접 작성하여 관계형 데이터베이스의 구조를 이해하고, 실무에서 자주 사용하는 데이터 조회 및 분석 쿼리를 연습합니다.


## 사용 환경

- **DBMS**: PostgreSQL  
- **도구**: `psql`, `pgAdmin 4`  
- **데이터베이스 이름**: `pizza_place`  
- **작성 파일**: `sprint-mission-6.sql`


## 테이블 구조 및 관계

총 4개의 테이블로 구성되어 있으며, 각 테이블 간 관계는 다음과 같습니다.

| 테이블명         | 설명 |
|------------------|------|
| `orders`         | 주문 정보 (주문 날짜, 시간 포함) |
| `order_details`  | 주문 상세 내역 (피자, 수량 등) |
| `pizzas`         | 판매 중인 피자 (크기, 가격 등) |
| `pizza_types`    | 피자 종류 정보 (이름, 구성 등) |

![ERD](https://bakey-api.codeit.kr/api/files/resource?root=static&seqId=13903&version=1&directory=/g7sswvmad-image.png&name=g7sswvmad-image.png)

## 문제 구성

- 초급
  - SELECT, WHERE, ORDER BY, LIMIT, OFFSET 기본 문법
  - 날짜 / 시간 필터링
  - 페이지네이션 (오프셋 기반, 커서 기반)

- 중급
  - GROUP BY를 통한 집계
  - 서브쿼리 활용
  - 조건 필터링 및 정렬

- 고급
  - 다중 테이블 JOIN
  - 피자별 판매량, 수익 계산
  - 일별 주문 통계 및 매출 분석