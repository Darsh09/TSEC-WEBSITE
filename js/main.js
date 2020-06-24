var complaintTable;
$(document).ready(function() {
	function adminUser() {
		var adminUser = getUser('admin', 'admin');
		if (!adminUser) {
			var users = JSON.parse(localStorage['users'] || '[]');
			users.push({
				username: 'admin', 
				password: 'admin'
			});
			localStorage['users'] = JSON.stringify(users);
		}
	}
	adminUser();
	
	function showMessage(message) {
		$("#message").html(message);		
		$( "#message").dialog({
			dialogClass: "no-close",
			modal: true,
			buttons: [{
				text: "OK",
				click: function() {
					$("#message").html('');
					$(this).dialog( "close" );
				}
			}]
		});
	}
	
	function writeComplaint(message) {
		var complaints = localStorage["complaintsTable"];
		try {
			if (complaints) {
				complaints = JSON.parse(complaints);
			} else {
				complaints = [];
			}

			complaints.push({
				User: localStorage['loggedInUser'],
				Comment: message
			});
			localStorage["complaintsTable"] = JSON.stringify(complaints);
		} catch (e) {
			showMessage("Error logging complaint; please try again later");
		}
	}
	
	function readComplaints() {
		var complaints = JSON.parse(localStorage["complaintsTable"] || "[]") ;
		if(localStorage['loggedInUser'] !== 'admin') {
			return $.grep(complaints, function(complaint, index) { 
				return complaint.User === localStorage['loggedInUser'];
			});
		}
		return complaints;
	}
	

	function getUser(username, password) {
		var users = JSON.parse(localStorage["users"] || "[]") ;
		
		return $.grep(users, function(user, index) { 
			return (user.username === username && user.password === password)
		})[0];
	}
	
	function getUserComplaints() {
		if (!complaintTable) {
			complaintTable = $('#complaint-table').DataTable({
				"columns": [
					{ "data": "User" },
					{ "data": "Comment" }
				],
				"data": readComplaints()
			});
		} else {
			complaintTable.clear().rows.add(readComplaints()).draw();
		}
	}
	
	function hideNewComplaint() {
		if(localStorage['loggedInUser'] === 'admin') {
			$("#new-complaint").hide();
		} else {
			$("#new-complaint").show();
		}
	}
	
	$("#signup").click(function() {
		var user = getUser($('#username').val().trim(), $('#password').val().trim());		
		if ($('#username').val().trim() === 'admin') {
			showMessage('You cannot signup as admin');
			return false;
		}
		
		if (!user) {
			var users = JSON.parse(localStorage["users"] || "[]");
			users.push({
				username: $('#username').val().trim(),
				password: $('#password').val().trim()
			});
			localStorage["users"] = JSON.stringify(users);
			showMessage("User has been successfully signed-up");			
		} else {
			showMessage('User already exists. Please login.');
		}
	});	

	$("#login").click(function() {
		var user = getUser($('#username').val().trim(), $('#password').val().trim());
		if (user) {
			localStorage['loggedInUser'] = user.username;			
			$('.main').hide();
			$('#logged-in-user').html(user.username);
			$('#header').show();
			hideNewComplaint();
			$('#complaint-list').show();
			getUserComplaints();
		} else {
			showMessage('Please signup using Signup button');
		}
	});
	
	$("#create").click(function() {
		var newComplaint = $('#newComplaint').val().trim();
		writeComplaint(newComplaint);
		getUserComplaints();
		$('#newComplaint').val('');
	});
});