#!/usr/bin/env groovy

node {
    stage('Install') {
        echo 'Installing...'
        sh 'npm install --production'
    }
    stage('Prebuild') {
        echo 'Prebuilding (Cleaning slate)...'
        sh 'npm run prebuild'
    }
    stage('Build') {
        echo 'Building...'
        sh 'npm run build'
    }
    stage('Test') {
        echo 'lol'
    }
    stage('Deploy') {
        sh 'npm run start-prod'
    }
}