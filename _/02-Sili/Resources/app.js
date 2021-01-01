if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// User interface (UI) construction
var win = Ti.UI.createWindow({
	backgroundColor: '#ffffff',
	title: 'Sili',
	layout: 'vertical'
});

var headerView = Ti.UI.createView({
	height: '10%',
	width: '100%',
	backgroundColor: '#cecfce'
});

headerView.add(Ti.UI.createLabel({
	text: 'Sili',
	left: 7,
	color: '#84596b',
	height: Ti.UI.FILL,
	verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
	font:{
		fontSize: '22sp',
		fontWeight: 'bold'
	}
}));

var edit = Titanium.UI.createButton({
	title: 'Edit',
	right: 7,
	visible: true,
	image: '/images/edit.png',
	width: 110,
	style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});

var done = Titanium.UI.createButton({
	title: 'Done',
	right: 5,
	visible: false,
	image: '/images/done.png',
	width: 110,
	style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});

headerView.add(edit);
headerView.add(done);

win.add(headerView);

var recordingsView = Ti.UI.createView({
	height: '65%',
	width: '100%'
});

var table = Ti.UI.createTableView({
	width: Ti.UI.FILL,
	height: Ti.UI.FILL,
	editable: true
});

recordingsView.add(table);
win.add(recordingsView);

var buttonView = Ti.UI.createView({
	width: '100%',
	height: '25%',
	backgroundColor: '#cecfce'
});

var recordButton = Ti.UI.createImageView({
	image: '/images/recording_off.png',
	height: '95%'
});

buttonView.add(recordButton);
win.add(buttonView);

// Make Table view "editable" to allow file deletion.
edit.addEventListener('click', function(e) {
	toggleEditMode();
});

done.addEventListener('click', function() {
	toggleEditMode();
});

function toggleEditMode() {
	edit.visible = !edit.visible;
	done.visible = !done.visible;
	table.editing = !table.editing;
}

// Table view events
table.addEventListener('click', function(e) {
	var sound = Ti.Media.createSound({
		url: e.rowData.fileName
	});
	sound.play();
});

table.addEventListener('delete', function(e) {
	var fileToDelete = Ti.Filesystem.getFile(e.rowData.fileName);

	Titanium.API.info("deleting file= " +  JSON.stringify(fileToDelete));
	fileToDelete.deleteFile();
});

// Record audio file
Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;

var APP_DATA_DIR = Ti.Filesystem.applicationDataDirectory;
var recorder = Ti.Media.createAudioRecorder();
recorder.compression = Ti.Media.AUDIO_FORMAT_ULAW;
recorder.format = Ti.Media.AUDIO_FILEFORMAT_WAVE;

// Load the table view with previously recorded audio files
loadExistingAudioFiles();

recordButton.addEventListener('click', function(e) {
	if (recorder.recording) {
		var buffer = recorder.stop();
		var newFile =Titanium.Filesystem.getFile(APP_DATA_DIR, new Date().getTime() + '.wav');

		newFile.remoteBackup = true;
		newFile.write(buffer);

		table.setData([]);
		loadExistingAudioFiles();

		// Switch to bottom speaker
		Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;

		e.source.image = '/images/recording_off.png';
	} else {
		// Record audio file
		Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;

		recorder.start();
		e.source.image = '/images/recording_on.png';
	}
});

function loadExistingAudioFiles() {
	// Read the audio files from device
	var dir = Ti.Filesystem.getFile(APP_DATA_DIR);
	var files = dir.getDirectoryListing();
	var tableData = [];

	for (var i = 0; i < files.length; i++) {
		var recording = Ti.Filesystem.getFile(APP_DATA_DIR, files[i]);
		var ts = new Date(recording.createTimestamp());
		var rowLabel = String.formatDate(ts, 'medium') + ' - ' + String.formatTime(ts);

		var row = Ti.UI.createTableViewRow({
			title: rowLabel,
			leftImage: '/images/tape.png',
			color: '#b58aa5',
			className: 'recording',
			font:{
				fontSize: '24sp',
				fontWeight: 'bold'
			},
			fileName: APP_DATA_DIR + '/' + recording.name
		});
		tableData.push(row);
	}

	table.setData(tableData);
}

win.open();