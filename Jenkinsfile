#!/usr/bin/env groovy

pipeline {
  agent none

  stages {
    stage ('Install') {
      steps {
        sh 'npm install'
      }  
    }

    stage ('Prebuild') {
      steps {
        sh 'npm run prebuild'
      }  
    }

    stage ('Build') {
      steps {
        sh 'npm run build'
      }  
    }

    stage ('Deploy') {
      steps {
        sh 'npm run start-prod'
      }  
    }
  }
}