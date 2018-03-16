echo off
cls
cf  spaces
echo Are you logged into the rlacey@wit Bluemix account?
 
 
cf push  angularbasics101b -f ./manifest.yml  --no-start
rem cf enable-diego angularbasics101a 
cf start angularbasics101b