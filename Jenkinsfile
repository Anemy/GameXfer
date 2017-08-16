pipeline {
    agent {
        docker {
            image 'node'
            args '-u root'
        }
    }

    stages {
        stage('Install') {
            steps {
                echo 'Installing...'
                npm install --production
            }
        }
        stage('Prebuild') {
            steps {
                echo 'Prebuilding (Cleaning slate)...'
                npm run prebuild
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                npm run build
            }
        }
        stage('Test') {
          steps {
            echo 'lol'
          }
        }
        stage('Deploy') {
          steps {
            npm run start:prod
          }
        }
    }
}