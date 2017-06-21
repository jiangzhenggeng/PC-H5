<?php
		//***************************page my****************************
		//我的专区
		//简单描述：包括题库列表,服务窗列表,我的错题库,移出错题库,新币明细,我的收藏,题目收藏保存,题目取消收藏
		//开发者：孙昊
		//最后修改日期：2016-11-28
		//**********************************************************************
		error_reporting(0);
		ini_set('date.timezone','Asia/Shanghai');
		header('Content-type: application/json; charset=utf-8');

		include ("../appapi/class/c_DB.php");
		include ("../appapi/class/c_Student.php");
		include ("../appapi/class/c_Subject.php");
		include ("../appapi/class/c_Category.php");
		include ("../appapi/class/c_Question.php");
		include ("../appapi/class/c_Timujilu.php");
		include ("../appapi/class/c_Book.php");
		include ("../appapi/class/c_BookBuy.php");
		include ("../appapi/class/c_Tiku.php");
		include ("../appapi/class/c_Xinbi.php");
		include ("../appapi/class/c_Collect.php");
		include ("../appapi/class/c_DoubtHF.php");
		include ("../appapi/class/c_DayPaperMy.php");
		include ("../appapi/class/c_DayPaper.php");
		include ("../appapi/tongyong/g_Function.php");


		$DB 		 = new TDB();
		$Student	 = new TStudent($DB);
		$Subject	 = new TSubject($DB);
		$Category	 = new TCategory($DB);
		$Question	 = new TQuestion($DB);
		$Timujilu	 = new TTimujilu($DB);
		$Book		 = new TBook($DB);
		$Tiku		 = new TTiku($DB);
		$Xinbi		 = new TXinbi($DB);
		$Collect	 = new TCollect($DB);
		$DoubtHF	 = new TDoubtHF($DB);
		$DayPaperMy	 = new TDayPaperMy($DB);
		$DayPaper	 = new TDayPaper($DB);
    $BookBuy	 = new TBookBuy($DB);

		try{	//异常控制

		$id		 = trim($_GET["id"]) ? trim($_GET["id"]) : "0";
		$apiname = trim($_GET["apiname"]) ? trim($_GET["apiname"]) : "";
		$apisign = trim($_GET["apisign"]) ? trim($_GET["apisign"]) : "";
		$arr	 = array();		//返回json数组
		$result	 = 100;			//返回状态值
		if (! checkApi($id,$apiname,$apisign)) throw new Exception("签名不正确！非法接口！");
  	if ( intval($id) && ( !isset($_GET["device_id"]) || !$Student->checkSession($id,trim($_GET["device_id"])) ) ){ throw new Exception("用户已掉线!");}


		switch ($apiname){
		//*******************我的首页*****************************************
		case "wdindex":
			//统计我的首页数据，返回数组：综合得分,zhdf,新币余额,xbye,购买题库的数量,gmtk,错题库的数量,ctk,即将开始的知识竞赛数量,zsjs,收藏的问题数量,scwt
			//综合得分=登录数+做题次数+正确的题次数*5+回答数*5,在线考试次数*10
			$sid		 = trim($_GET["sid"]) ? trim($_GET["sid"]) : 0;
			if (! ($id and $Student->GetStudent($id))){
				$result = 501;
				break;
			}
			$arr["name"] = $Student->Name;
			$arr["icon"] = trim($Student->Face) ? trim($Student->Face) : "/statices/public/default.jpg";
			$arr["zhdf"] = $Student->Logincount + $Timujilu->MyCountZTCS($id) + ($Timujilu->MyCountZQZTCS($id))*5 + ($DoubtHF->MyCountHFS($id))*5 + ($DayPaperMy->MyCountKSS($id))*10;
			$arr["xbye"] = $Xinbi->CountMy($id);
			$arr["gmtk"] = $Tiku->CountBuyTiku($id);
			$arr["ctk"]	 = $Timujilu->MyCountZTK($id,$sid);
			$arr["zsjs"] = $DayPaper->CountZSJSGo();
			$arr["scwt"] = $Collect->CountMySC($id,$sid);
			break;


		//*******************题库列表*****************************************
		case "tklb":

			if (! $id){
				$result = 502;
				break;
			}
			$i1   = 1;
			$f1	  = false;
			$arr1 = array();
			$arr2 = array();
			$arr3 = array();
			$List = $Subject->GetListByTK($Tiku->Professionalid);
			while ($Subject->GetRow($List)){
				$arr1[$i1]["id"]		  = $Subject->Pfsid;
				$arr1[$i1]["name"]		  = $Subject->Pfsname;
				$arr1[$i1]["subjectname"] = $Subject->Name;
				$arr1[$i1]["jiage"]		  = $Subject->ID;
				if ($Tiku->GetListByUser($id, $Subject->Pfsid)){
					//数据库：0,试用1试用待审核，2线上购买，3线上待支付，4学习卡支付，5后台人工审核，6培训人员添加
					//接口：  0无专业（试用）1申请试用2待审核3试用中4试用到期5购买中6已购买7购买过期
					$f1 = true;
					$arr1[$i1]["riqi"] = $Tiku->Endtime;
					if ($Tiku->State == 0)
						$arr1[$i1]["state"] = ($Tiku->Endtime < time()) ? 4 : 3;
					else if ($Tiku->State == 1)
						$arr1[$i1]["state"] = 2;
					else if ($Tiku->State == 2)
						$arr1[$i1]["state"] = ($Tiku->Endtime < time()) ? 7 : 6;
					else if ($Tiku->State == 3)
						$arr1[$i1]["state"] = 5;
					else if ($Tiku->State > 3)
						$arr1[$i1]["state"] = 6;
				}else{
					$arr1[$i1]["state"]	  = 0;
					$arr1[$i1]["riqi"]	  = "";
				}
				$i1++;
			}

			$i1 = 1;
			foreach($arr1 as $key1=>$value1){
				$arr1[$key1]["state"] = ($f1 and ($arr1[$key1]["state"]==0)) ? 1 : ($arr1[$key1]["state"]);
				if (($arr1[$key1]["state"]==0 or $arr1[$key1]["state"]==2 or $arr1[$key1]["state"]>3) and ($arr1[$key1]["riqi"] > time())){
					$arr2[$i1] = $arr1[$key1];
					unset($arr1[$key1]);
					$i1++;
				}
			}
			foreach($arr1 as $key1=>$value1){
				$arr2[$i1] = $arr1[$key1];
				$i1++;
			}
			foreach($arr2 as $key1=>$value1)
				$arr2[$key1]["riqi"] = ($arr2[$key1]["riqi"]) ? (date('Y-m-d H:i:s', $arr2[$key1]["riqi"])) : "";

			$arr["sjsz"] = $arr2;
			break;

			//*******************服务窗购买列表*****************************************
			case "fwc_order_list":

				if (! $id){
					$result = 503;
					break;
				}
				//$i1   = 1;
				$order_list = [];
				$List = $BookBuy->GetBookOrderList($id);
				while ($BookBuy->GetRow($List)){
					$order_list[] = ["id"=> $BookBuy->ID,
														"ordernumber"=> $BookBuy->Ordernumber,
														"ebid"=>$BookBuy->Ebid,
														"ordername"=>$BookBuy->Ordername,
														"name"=>$BookBuy->Realname,
														"phone"=>$BookBuy->Phone,
														"address"=>$BookBuy->Areainfo,
														"amount"=>$BookBuy->Totalprice,
														"ispay"=>intval($BookBuy->Ispay),
														"payat"=>$BookBuy->Paytime?date("Y-m-d H:i",$BookBuy->Paytime):null,
														"userid"=>$BookBuy->Studentid,
														"username"=>$BookBuy->Username,
														"ordertime"=> date("Y-m-d H:i",$BookBuy->Ordertime)
														];
				}

				$arr["list"] = $order_list;
				break;

		//*******************服务窗列表*****************************************
		case "fwclb":
			$type	 = trim($_GET["type"]) ? trim($_GET["type"]) : 0;
			if (! $id){
				$result = 503;
				break;
			}
			$i1   = 1;
			$arr1 = array();
			$List = $Book->GetListByType($type+1);
			while ($Book->GetRow($List)){
				$arr1[$i1]["id"]   = $Book->ID;
				$arr1[$i1]["name"] = $Book->Title;
				$arr1[$i1]["icon"] = $Book->Img;
				$arr1[$i1]["ms"]   = $Book->Descriptions;
				$arr1[$i1]["yj"]   = $Book->Oldprice;
				$arr1[$i1]["xj"]   = $Book->Price;
				$arr1[$i1]["author"]   = $Book->Author;
				$arr1[$i1]["publisher"]   = $Book->Publisher;
				$i1++;
			}
			$arr["sjsz"] = $arr1;
			break;


		//*******************我的错题库*****************************************
		case "wdctk":
			$sid = isset($_GET["sid"])&&trim($_GET["sid"]) ? intval(trim($_GET["sid"])) : 0;
			if (! $id || !$sid){
				$result = 504;
				break;
			}
			$arr = $Timujilu->GetTkArray($id,$sid);
			break;


		//*******************移出错题库*****************************************
		case "ycctk":
			$qid = trim($_GET["qid"]) ? trim($_GET["qid"]) : 0;
			if (! ($qid and $Timujilu->UpdateMoveErr($qid, $id))){
				$result = 505;
				break;
			}
			break;


		//*******************新币明细*****************************************
		case "xbmx":
			$page = trim($_GET["page"]) ? trim($_GET["page"]) : 1;
			if (! $id){
				$result = 506;
				break;
			}
			$i1   = 1;
			$arr1 = array();
			$arr2 = array("专家提问支出","回答问题被采纳获得","注册获得","购买题库获得","提问支出","资料兑换支出");
			$List = $Xinbi->GetListByUser($id, $page);
			while ($Xinbi->GetRow($List)){
				$arr1[$i1]["name"]  = $arr2[$Xinbi->XBType];
				$arr1[$i1]["count"] = $Xinbi->Number;
				$arr1[$i1]["date"]  = date('Y-m-d H:i:s', $Xinbi->Datetime);
				$i1++;
			}
			$arr["sjsz"] = $arr1;
			break;


		//*******************我的收藏(题目收藏列表)*****************************************
		case "wdsc":
			$page = isset($_GET["page"])&&trim($_GET["page"]) ? trim($_GET["page"]) : 1;
			$sid = isset($_GET["sid"])&&trim($_GET["sid"]) ? intval(trim($_GET["sid"])) : 0;
			if (!$id || !$sid){
				$result = 507;
				break;
			}
			$i1   = 1;
			$arr1 = array();
			$List = $Collect->GetListByUser($id, $page , $subjectid);
			while ($Collect->GetRow($List)){
				$arr1[$i1]["id"] = $Collect->Questionid;
				$arr1[$i1]["date"]  = date('Y-m-d', $Collect->Collecttime);
				$Question->GetQuestion($Collect->Questionid);
				$Subject->GetSubject($Question->Subjectid);
				$Category->GetRootIDByCatid($Question->Catid);
				$arr1[$i1]["name"] = "<font color='red'>[".$Question->Typedesc[$Question->QsType]."]</font>".$Question->Name;
				$arr1[$i1]["sname"] = "《".$Subject->Name."》".$Category->Name;
				$i1++;
			}
			$arr["sjsz"] = $arr1;
			break;


		//*******************题目收藏保存*****************************************
		case "tmscbc":
			$qid = trim($_GET["qid"]) ? trim($_GET["qid"]) : 0;
			if (! ($qid and $Question->GetQuestion($qid))){
				$result = 508;
				break;
			}
			$cid = $Collect->IsCollected($Question->ID, $id);
			if ($cid){
				$Collect->ID		  = $cid;
				$Collect->Collecttime = time();
				$Collect->Update1();
			}else{
				$Collect->Questionid  = $Question->ID;
				$Collect->Userid	  = $id;
				$Collect->Collecttype = 1;
				$Collect->Collecttime = time();
				$Collect->Add($Question->QsType,$Question->Subjectid,$Question->Catid);
			}
			break;


		//*******************题目取消收藏*****************************************
		case "tmqxsc":
			$qid = trim($_GET["qid"]) ? trim($_GET["qid"]) : 0;
			if (! $qid){
				$result = 509;
				break;
			}
			$Collect->Questionid  = $qid;
			$Collect->Userid	  = $id;
			if (! $Collect->Del1()){
				$result = 509;
				break;
			}
			break;


		//*******************异常接口名********************************************
		default:
		  throw new Exception("接口名不正确！非法接口！");
		}


		$arr["result"] = $result;
		//print_r($arr);


		//*******************异常处理********************************************
		}catch (Exception $ee){	//记录异常日志
			errLog($ee);//die($ee);
			$arr = ["result"=> ( strpos($ee,"已掉线") ? 997 : (strpos($ee,"[hsrd_sql]")===false ? 999 : 998) ) ] ;	//返回异常状态 999
		}finally{
			echo json_encode($arr);
		}
?>
