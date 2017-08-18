pipeline {
  stage ('Install') {
    sh 'npm install'
  }

  stage ('Prebuild') {
    sh 'npm run prebuild'
  }

  stage ('Build') {
    sh 'npm run build'
  }

  stage ('Deploy') {
    sh 'npm run start-prod'
  }
}