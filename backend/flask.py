from flask import Flask, request, jsonify
import os
import subprocess

app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
			filename = file.filename
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
			input_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
			output_file = os.path.join(
				app.config['UPLOAD_FOLDER'], filename.split('.')[0] + '.m3u8')

			command = ['ffmpeg', '-i', input_file, '-hls_time',
					'10', '-hls_list_size', '0', output_file]
			subprocess.run(command)
			return jsonify({'message': 'File uploaded successfully', 'filename': filename})



if __name__ == '__main__':
    app.run(debug=True)
