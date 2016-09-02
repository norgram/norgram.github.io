<!DOCTYPE html>
<html lang='da'>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<!-- IE: Force to always use the latest version - if chrome frame is installed use this instead -->
		<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
		<meta name="viewport" content="initial-scale=.8">
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="pragma" content="no-cache" />

		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

		<title>Norgram - Digital Design Studio</title>

		<link rel="stylesheet" type="text/css" href="assets/images/icons/favicon.ico">

		<!-- Meta description and keywords -->
		<meta name="description" content="We are the Design Director duo of internationally recognized and awarded designers Sebastian Gram &amp; Mathias Høst Normark.">
		<meta name="keywords" content="grafisk designer, art director, webdesigner, magasinlayouter, TVgrafiker" />

		<!-- FB icons -->
		<meta property="og:title" content="Norgram — Digital Design Studio">
		<meta property="og:site_name" content="Norgram">
		<meta property="og:url" content="http://www.norgram.co/" />
		<meta property="og:type" content="website" />
		<meta property="og:image" content="http://www.norgram.co/images/social.png">
		<meta property="og:description" content="We are the Design Director duo of internationally recognized and awarded designers Sebastian Gram &amp; Mathias Høst Normark.">

		<!-- for Twitter -->
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:site" content="@norgramstudio">

		<meta name="twitter:title" content="Norgram — Digital Design Studio" />
		<meta name="twitter:description" content="We are the Design Director duo of internationally recognized and awarded designers Sebastian Gram &amp; Mathias Høst Normark." />
		<meta name="twitter:image" content="http://www.norgram.co/images/social.png" />

		<!-- CSS -->
 		<link rel="stylesheet" type="text/css" href="css/main.css">
<!--		<link rel="stylesheet" type="text/css" href="assets/css/lists.css">
 -->

	</head>

	<body>
		<!-- Outsider Lib -->
		<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>

		<!-- Tools n Utils -->
		<script src="js/lib/setsnail/system/BrowserDetect.js"></script>
		<script src="js/lib/setsnail/debug/Debug.js"></script>
		<script src="js/lib/setsnail/animation/AnimationUtils.js"></script>
		<script src="js/lib/setsnail/utils/Trace.js"></script>
		<script src="js/lib/setsnail/utils/EventDispatcher.js"></script>
		<script src="js/lib/setsnail/utils/ColorUtils.js"></script>
		<script src="js/lib/setsnail/utils/CSS.js"></script>
		<script src="js/lib/setsnail/utils/Snail.js"></script>
		<script src="js/lib/setsnail/utils/ArrayUtils.js"></script>
		<script src="js/lib/setsnail/utils/RenderEngine.js"></script>
		<script src="js/lib/setsnail/utils/StringUtils.js"></script>
		<script src="js/lib/setsnail/utils/instafeed.min.js"></script>
		<script src="js/lib/setsnail/utils/MapUtils.js"></script>
		<script src="js/lib/setsnail/share/ShareUtils.js"></script>
		<script src="js/lib/setsnail/search/SearchManager.js"></script>
		<script src="js/lib/setsnail/text/Text.js"></script>
		<script src="js/lib/setsnail/prototype/array/sortOn.js"></script>

		<!-- TouchLib -->
		<script src="js/lib/setsnail/touch/Touchable.js"></script>
		<script src="js/lib/setsnail/touch/TouchDragger.js"></script>

		<script src="js/lib/setsnail/touch/utils/DragGroup.js"></script>
		<script src="js/lib/setsnail/touch/utils/DragInfo.js"></script>
		<script src="js/lib/setsnail/touch/utils/GroupDragger.js"></script>
		<script src="js/lib/setsnail/touch/utils/TouchInfo.js"></script>
		<script src="js/lib/setsnail/touch/utils/EaseInfo.js"></script>

		<script src="js/lib/setsnail/touch/plugins/DraggerPlugin.js"></script>
		<script src="js/lib/setsnail/touch/plugins/DraggerEasePlugin.js"></script>
		<script src="js/lib/setsnail/touch/plugins/DragBasic.js"></script>
		<script src="js/lib/setsnail/touch/plugins/DragBounds.js"></script>
		<script src="js/lib/setsnail/touch/plugins/DragEase.js"></script>

		<script src="js/lib/setsnail/utils/Rectangle.js"></script>
		<script src="js/lib/setsnail/utils/MathUtils.js"></script>

		<!-- ResizeManager -->
		<script src="js/lib/setsnail/resize/ResizeManager.js"></script>
		<script src="js/lib/setsnail/resize/ResizeManagerSettings.js"></script>
		<script src="js/lib/setsnail/resize/ResizeEvents.js"></script>

		<!-- RetinaHandler -->
		<script src="js/lib/setsnail/image/RetinaImage.js"></script>
		<script src="js/lib/setsnail/retina/RetinaHandle.js"></script>
		<script src="js/lib/setsnail/retina/RetinaHandleEvents.js"></script>

		<!-- ContentManager -->
		<script src="js/lib/setsnail/contentManager/ContentManager.js"></script>
		<script src="js/lib/setsnail/contentManager/TemplateData.js"></script>

		<!--
		END SnailLib
		-->

		<!-- Src -->
		<script src="js/src/Main.js"></script>
		<script src="js/src/setsnail/Config.js"></script>
		<script src="js/src/setsnail/Assets.js"></script>
		<script src="js/src/setsnail/ui/UIColors.js"></script>
		<script src="js/src/setsnail/utils/GuideLines.js"></script>
		<script src="js/src/setsnail/utils/ScrollController.js"></script>

		<script src="js/src/setsnail/ui/buttons/TextButton.js"></script>
		<script src="js/src/setsnail/ui/text/TextArea.js"></script>

		<!-- Templates -->
		<script src="js/src/setsnail/templates/PageTemplate.js"></script>
		<script src="js/src/setsnail/templates/TemplateHome.js"></script>
		<script src="js/src/setsnail/templates/TemplateCase.js"></script>
		<script src="js/src/setsnail/templates/TemplateCasesOverview.js"></script>
		<script src="js/src/setsnail/templates/TemplatePrincip.js"></script>
		<script src="js/src/setsnail/templates/TemplateProfil.js"></script>


		<!-- Modules -->
		<script src="js/src/setsnail/ui/modules/Module.js"></script>
		<script src="js/src/setsnail/ui/modules/ReturnModule.js"></script>
		<script src="js/src/setsnail/ui/modules/BasicHomeModule.js"></script>

        <script src="js/src/setsnail/ui/modules/home/HomeStoryModule.js"></script>

        <script src="js/src/setsnail/ui/modules/casesoverview/OverviewCaseModule.js"></script>

        <script src="js/src/setsnail/ui/modules/principles/PrincipleSectionModule.js"></script>

		<script src="js/src/setsnail/ui/modules/profile/ProfileEmployeeModule.js"></script>
		<script src="js/src/setsnail/ui/modules/profile/ProfileInfoModule.js"></script>
		<script src="js/src/setsnail/ui/modules/profile/ProfileEmployee.js"></script>

        <!-- Components -->
        <script src="js/src/setsnail/ui/components/Footer.js"></script>
        <script src="js/src/setsnail/ui/components/HomeStory.js"></script>


		<!-- Menu -->
		<script src="js/src/setsnail/ui/menu/MainMenu.js"></script>
		<script src="js/src/setsnail/ui/menu/MenuBorder.js"></script>
		<script src="js/src/setsnail/ui/menu/MenuBorderLines.js"></script>
		<script src="js/src/setsnail/ui/menu/MenuLogo.js"></script>

		<script src="js/src/setsnail/ui/menu/MenuContent.js"></script>
		<script src="js/src/setsnail/ui/menu/MenuContactInfo.js"></script>
		<script src="js/src/setsnail/ui/menu/MenuFooter.js"></script>
		<script src="js/src/setsnail/ui/menu/MenuSelector.js"></script>
		<script src="js/src/setsnail/ui/menu/MenuSocial.js"></script>

		<?php
			include("content/_cache.html");
		?>

		<!-- Initialize site -->
		<script>
			window.onload = function() {
				document.body.style.margin = 0;
				document.body.style.padding = 0;
				document.body.style.color = "#1c1c1c";
				document.body.style.fontSize = "17px";
				document.body.style.fontStyle = "normal";
				document.body.style.overflowX = "hidden";
				document.body.style.width = "100%";
				document.body.style.height = "100%";

				var main = new Main();
				document.body.appendChild(main);
				main.init();
			};
		</script>
	</body>
</html>
