# Cordova skeleton application

## Getting started

### Prerequisites
* JDK
* Android SDK
* Cordva
* Talan CLI

### Attach to the existing project

* Add skeleton as subtree
```
git remote add tln-cordova https://github.com/project-talan/tln-cordova.git
git subtree add --prefix mobile/cordova-app tln-cordova master --squash
```
* Update to get latest version
```
git subtree pull --prefix mobile/cordova-app tln-cordova master --squash
```

### or Fork/clone repository
To develop standalone project, just clone repository or create fork using your account

## Configure project
* run ```tln prereq```, update .env file with your local dev env parameters
* run ```tln create-app```, update config.xml and package.json with project's actual values
* add platform ```cordova platform add android```
* build and deploy projects ```tln build-angular:deploy-android```

## SDLC

| Command | Script | Description |
| ------- | ------ | ----------- |
| tln prereq | prereq.sh | Prepare local dev box configuration scripts |

## FAQ
### net::ERR_CLEARTEXT_NOT_PERMITTED error
https://stackoverflow.com/questions/54752716/why-am-i-seeing-neterr-cleartext-not-permitted-errors-after-upgrading-to-cordo
