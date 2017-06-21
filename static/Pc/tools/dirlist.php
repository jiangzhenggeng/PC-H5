<?php
ini_set('display_errors','1');
error_reporting(E_ALL);

function listDir($dir){
    if(!is_dir($dir)){
        return array();
    }
    $dirHandle = opendir($dir);
    while ($file = readdir($dirHandle)){
        if(in_array($file,array('.','..'))){
            continue;
        }
        if( is_dir($dir.'/'.$file)){
            listDir($dir.'/'.$file);
        }else{
            echo str_replace('/usr/share/nginx/html/cdn/static/Pc/tools/../','http://cdn.jiguo.com/static/Pc/',$dir.'/'.$file).'<br/>';
        }
    }
}

$str = file_get_contents(dirname(__FILE__).'/build_main.js');

preg_match('/compression_([\d\.]+)\//i',$str,$match);
$viesion = $match[1];

define('BASE',dirname(__FILE__).'/../compression_'.$viesion.'/');

listDir(BASE.'script');

echo '<br><br><br>';

listDir(BASE.'style');




