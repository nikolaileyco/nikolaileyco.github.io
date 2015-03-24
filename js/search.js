/*
Either the API aren't CORS enabled, or I can't find the sign-up link for the API to enable a domain for CORS
var xmlhttp;
if (window.XMLHttpRequest)
{// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			//parse json
			var textResponse = xmlhttp.responseText;
			var response = JSON.parse(textResponse);
			
		}
	};
	xmlhttp.open("GET", "", true);
	xmlhttp.send();

}
*/

var Search = function(options){
	var properties = {
		'base_url': 'https://api.twitch.tv/kraken/search/streams?limit=5',
		'prev_page_id': 'page-prev',
		'next_page_id': 'page-next',
		'search_form_id': 'twitch-search',
		'search_text_id': 'twitch-search-text',
		'list_id': 'twitch-streams',
		'page_total_id': 'page-total',
		'page_count_id': 'page-count',
		'search_pre_id' : 'search-pre',
		'searching_id' : 'searching',
		'search_no_result_id' : 'search-no-result',
		'search_no_connect_id' : 'search-could-not-connect',
		'search_header_id': 'search-header',
		'total_results_id': 'total-results',
		'callback': 'Search.populate'
	};

	if (typeof(options) != 'undefined' && options != null){
		for (var attrname in options) { 
			properties[attrname] = options[attrname]; 
		}
	}

	this.currentPage = 0;
	this.prevPageElem = document.getElementById(properties.prev_page_id);
	this.nextPageElem = document.getElementById(properties.next_page_id);
	this.searchHeaderElem = document.getElementById(properties.search_header_id);
	this.searchTextElem = document.getElementById(properties.search_text_id);
	this.searchPreElem = document.getElementById(properties.search_pre_id);
	this.searchingElem = document.getElementById(properties.searching_id);
	this.searchFormElem = document.getElementById(properties.search_form_id);
	this.searchNoResultElem = document.getElementById(properties.search_no_result_id);
	this.searchNoConnectElem = document.getElementById(properties.search_no_connect_id);
	this.twitchStreamListElem = document.getElementById(properties.list_id);
	this.pageTotalElem = document.getElementById(properties.page_total_id);
	this.pageCountElem = document.getElementById(properties.page_count_id);
	this.totalResultsElem = document.getElementById(properties.total_results_id);
	this.success = false;
	this.failureTimeout = null;

	var $this = this;

	this.processSearchForm = function(e){
		if (e.preventDefault){
	    	e.preventDefault();
	    }

	    /*
	    wasn't working in chrome, switching other method
		$this.searchPreElem.style = 'display: none';
		$this.searchNoResultElem.style = 'display: none';
		$this.searchNoConnectElem.style = 'display: none';
		$this.twitchStreamListElem.style = 'display: none';
	    $this.searchingElem.style = 'display: block';
	    */
	    $this.searchPreElem.style.display = 'none';
		$this.searchNoResultElem.style.display = 'none';
		$this.searchNoConnectElem.style.display = 'none';
		$this.twitchStreamListElem.style.display = 'none';
	    $this.searchingElem.style.display = 'block';

    	$this.doSearch($this.searchTextElem.value)
    
    	return false;
	};

	this.prevPageLinkHandler = function(e){
		--$this.currentPage;
		if (e.preventDefault){
			e.preventDefault();
		}

		$this.pageHandler.call(this);

		return false;
	};

	this.nextPageLinkHandler = function(e){
		++$this.currentPage;
		if (e.preventDefault){
			e.preventDefault();
		}

		$this.pageHandler.call(this);

		return false;
	};

	this.pageHandler = function(){
		clearTimeout($this.failureTimeout);
		var script = document.createElement('script');
		script.src = this.href + '&callback=' + properties.callback;

		document.getElementsByTagName('head')[0].appendChild(script);
		$this.beginErrorCheck();
	};

	this.doSearch = function(searchTerm){
		clearTimeout($this.failureTimeout);
		searchTerm = encodeURIComponent(searchTerm);
		var script = document.createElement('script');
		script.src = properties.base_url + '&callback='+properties.callback+'&q=' + searchTerm;

		document.getElementsByTagName('head')[0].appendChild(script);
		$this.beginErrorCheck();

		//$this.searchPreElem.style = 'display: none';
		$this.searchPreElem.style.display = 'none';

		//reset page number
		$this.currentPage = 1;
	};

	//let's add a timeout, in case it doesn't connect
	this.beginErrorCheck = function(){
	    $this.failureTimeout = setTimeout(function(){
	    	/*
			$this.searchNoConnectElem.style = 'display: block';
			$this.searchHeaderElem.style = 'display: none';
			$this.searchPreElem.style = 'display: none';
			$this.searchNoResultElem.style = 'display: none';
			$this.twitchStreamListElem.style = 'display: none';
		    $this.searchingElem.style = 'display: none';
		    */
		    $this.searchNoConnectElem.style.display = 'block';
			$this.searchHeaderElem.style.display = 'none';
			$this.searchPreElem.style.display = 'none';
			$this.searchNoResultElem.style.display = 'none';
			$this.twitchStreamListElem.style.display = 'none';
		    $this.searchingElem.style.display = 'none';
    	}, 2000); //2 seconds sounds reasonable, but I don't know enough about the twitch api to say
	}

	this.clearElement = function(element){
		while( element.firstChild ){
			element.removeChild( element.firstChild );
		}
	};

	this.linkClick = function(e){
		if (e.preventDefault){
			e.preventDefault();
		}
		document.location.href = this.getAttribute('data-link');
		return false;
	};

	this.populate = function(response){
		clearTimeout($this.failureTimeout);
		//$this.searchingElem.style = 'display: none';
		$this.searchingElem.style.display = 'none';
		if (response._total == 0){
			/*
			$this.searchNoResultElem.style = 'display: block';
			$this.twitchStreamListElem.style = 'display: none';
			$this.searchHeaderElem.style = 'display: none';
			*/
			$this.searchNoResultElem.style.display = 'block';
			$this.twitchStreamListElem.style.display = 'none';
			$this.searchHeaderElem.style.display = 'none';
		}
		else{
			/*
			$this.searchNoResultElem.style = 'display: none';
			$this.twitchStreamListElem.style = 'display: block';
			$this.searchHeaderElem.style = 'display: block';
			*/
			$this.searchNoResultElem.style.display = 'none';
			$this.twitchStreamListElem.style.display = 'block';
			$this.searchHeaderElem.style.display = 'block';

			//let's set our pages
			var totalPages = Math.ceil(response._total/5);
			$this.clearElement(pageCountElem);
			$this.clearElement(pageTotalElem);
			$this.pageCountElem.appendChild(document.createTextNode($this.currentPage));
			$this.pageTotalElem.appendChild(document.createTextNode(totalPages));
			
			//let's clear our list
			$this.clearElement(twitchStreamListElem);

			//let's set next and prev
			if (response._links.next != null && $this.currentPage < totalPages){
				$this.nextPageElem.style = '';
				$this.nextPageElem.href = response._links.next;
			}else{
				//$this.nextPageElem.style = 'display: none';
				$this.nextPageElem.style.display = 'none';
				$this.nextPageElem.href = "#";
			}

			if (response._links.prev != null){
				$this.prevPageElem.style = '';
				$this.prevPageElem.href = response._links.prev;
			}else{
				//$this.prevPageElem.style = 'display: none';
				$this.prevPageElem.style.display = 'none';
				$this.prevPageElem.href = "#";
			}

			$this.totalResultsElem.innerHTML = response._total;
			//add whatever items we found
			for (var i = 0; i < response.streams.length; i++){
				$this.addItem(response.streams[i].channel.url, response.streams[i].preview.medium, response.streams[i].channel.display_name,
					response.streams[i].channel.game, response.streams[i].viewers, response.streams[i].channel.status);
			}
		}
	};

	this.addItem = function(link, previewImg, title, gameName, viewerCount, description){
		/*
			target html:
			<li class="twitch-stream-details">
				<div class="stream-thumb">
					<img />
				</div>
				<div class="stream-content">
					<h1>Stream display name</h1>
					<div><span>Game name</span> - <span>1234</span> viewers</div>
					<p>Description</p>
				</div>
			</li>
		*/

		var listItem = document.createElement('li');
		listItem.className = "twitch-stream-details";
		listItem.setAttribute('data-link', link);

		//begin thumb
		var thumbDiv = document.createElement('div');
		thumbDiv.className = "stream-thumb"
		var previewImgElem = document.createElement('img');
		previewImgElem.src = previewImg;
		thumbDiv.appendChild(previewImgElem);

		listItem.appendChild(thumbDiv);

		//begin content
		var contentDiv = document.createElement('div');
		contentDiv.className = "stream-content";

		var h1 = document.createElement('h1');
		var heading = document.createTextNode(title);
		h1.appendChild(heading);
		contentDiv.appendChild(h1);
		
		var gameInfo = document.createElement('div');
		var gameInfoText = document.createTextNode(gameName + ' - ' + viewerCount + ' viewers');
		gameInfo.appendChild(gameInfoText);
		contentDiv.appendChild(gameInfo);

		var descriptionP = document.createElement('p');
		var descriptionNode = document.createTextNode(description)
		descriptionP.appendChild(descriptionNode);
		contentDiv.appendChild(descriptionP);

		listItem.appendChild(contentDiv);

		$this.twitchStreamListElem.appendChild(listItem);
		
		if (listItem.attachEvent) {
		    listItem.attachEvent("click", $this.linkClick);
		} else {
		    listItem.addEventListener("click", $this.linkClick);
		}
	}

	//set event listeners
	if (this.searchFormElem.attachEvent) {
	    this.searchFormElem.attachEvent("submit", this.processSearchForm);
	    this.prevPageElem.attachEvent("click", this.prevPageLinkHandler);
	    this.nextPageElem.attachEvent("click", this.nextPageLinkHandler);
	}
	else {
	    this.searchFormElem.addEventListener("submit", this.processSearchForm);
	    this.prevPageElem.addEventListener("click", this.prevPageLinkHandler);
	    this.nextPageElem.addEventListener("click", this.nextPageLinkHandler);
	}

	return this;
}

var search = Search({
	'callback': 'search.populate'
});