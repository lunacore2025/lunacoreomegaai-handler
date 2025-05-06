# Node.js 공식 이미지 사용
FROM node:20

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 코드 복사
COPY . .

# 포트 열기
EXPOSE 8080

# 앱 실행
CMD [ "node", "index.js" ]
