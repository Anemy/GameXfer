#!/usr/bin/env groovy

node {
    stages {
        stage('Install') {
            steps {
                echo 'Installing...'
                sh 'npm install --production'
            }
        }
        stage('Prebuild') {
            steps {
                echo 'Prebuilding (Cleaning slate)...'
                sh 'npm run prebuild'
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'lol'
            }
        }
        stage('Deploy') {
            steps {
                sh 'npm run start-prod'
            }
        }
    }
}