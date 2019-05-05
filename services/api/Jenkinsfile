def configBuildEnv(configFile) {
  def tools = [
    'openjdk': ['envs':['JAVA_HOME'], 'paths':['/bin'], 'validate':'java -version'],
    'nodejs': ['envs':['NODEJS_HOME'], 'paths':['/bin'], 'validate':'node -v'],
    'maven': ['envs':['MAVEN_HOME', 'M2_HOME'], 'paths':['/bin'], 'validate':'mvn -v']
  ]
  def config = [:]
  if (fileExists(configFile)) {
    print("Use Configuration from ${configFile}")
    config = readJSON file: configFile
  }else{
    print('Default VM setup will be used')
  }
  printTopic('Build environment config')
  print(config)
  // configure
  config.each { prop, val -> 
    if (tools[prop]) {
      sh "echo Configurint ${prop} using ${val} version"
      def t = tool "${val}"
      tools[prop].envs.each { e ->
        env[e] = "${t}"
      }
      tools[prop].paths.each { p ->
        env.PATH = "${t}${p}:${env.PATH}"
      }
      // validate setup
      sh "${tools[prop].validate}"
    }
  }
}

def sendEmailNotification(subj, recepients) {
  emailext body: "${BUILD_URL}",
  recipientProviders: [
    [$class: 'CulpritsRecipientProvider'],
    [$class: 'DevelopersRecipientProvider'],
    [$class: 'RequesterRecipientProvider']
  ],
  subject: subj,
  to: "${recepients}"
}

def printTopic(topic) {
  println("[*] ${topic} ".padRight(80, '-'))
}

node {
  //
  def pullRequest = false
  def commitSha = ''
  def buildBranch = ''
  def pullId = ''
  def lastCommitAuthorEmail = ''
  def repo = ''
  def org = ''
  //
  stage('Clone sources') {
    //
    def scmVars = checkout scm
    printTopic('Job input parameters');
    println(params)
    printTopic('SCM variables')
    println(scmVars)
    // configure build env
    configBuildEnv('build.conf.json');
    //
    commitSha = scmVars.GIT_COMMIT
    buildBranch = scmVars.GIT_BRANCH
    if (buildBranch.contains('PR-')) {
      pullRequest = true
      pullId = CHANGE_ID
    } else if (params.containsKey('sha1')){
      pullRequest = true
      pullId = ghprbPullId
    } else {
    }
    //
    sh 'envsubst < .env.template > .env';
    sh 'envsubst < sonar-project.properties.template > sonar-project.properties';
    //
    printTopic('Build info')
    echo "[PR:${pullRequest}] [BRANCH:${scmVars.GIT_BRANCH}] [COMMIT: ${scmVars.GIT_COMMIT}]"
    printTopic('Environment variables')
    echo sh(returnStdout: true, script: 'env')
    //
    repo = sh(returnStdout: true, script:'''git config --get remote.origin.url | rev | awk -F'[./:]' '{print $2}' | rev''').trim()
    org = sh(returnStdout: true, script:'''git config --get remote.origin.url | rev | awk -F'[./:]' '{print $3}' | rev''').trim()
    //
    printTopic('Repo parameters')
    echo "[org:${org}] [repo:${repo}]"
    //
    lastCommitAuthorEmail = sh(returnStdout: true, script:'''git log --format="%ae" HEAD^!''').trim()
    if (!pullRequest){
      lastCommitAuthorEmail = sh(returnStdout: true, script:'''git log -2 --format="%ae" | paste -s -d ",\n"''').trim()
    }
    printTopic('Author(s)')
    echo "[lastCommitAuthorEmail:${lastCommitAuthorEmail}]"
  }
  stage('Init') {
    sh './init.sh';
  }
  stage('Build') {
    sh './build.sh';
  }
  stage('Unit test') {
    sh './test.sh';
  }
  stage('Delivery') {
  }
  stage('Deploy') {
  }
}