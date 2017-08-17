node {
  stage 'Install'
  sh 'npm install --production'

  stage 'Prebuild'
  sh 'npm run prebuild'

  stage 'Build'
  sh 'npm run build'

  stage 'Deploy'
  sh 'npm run start-prod'
}