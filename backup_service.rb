# frozen_string_literal: true

# Backup service to create and upload backup
class BackupService
  DROPBOX_UPLOAD_URL = 'https://content.dropboxapi.com/2/files/upload'

  def initialize(backup_obj)
    @backup_obj = backup_obj
    Rails.root.join('config', 'database.yml')
    @db_config = YAML.load_file(Rails.root.join('config', 'database.yml'))[Rails.env]
    @dropbox_config = YAML.load_file(Rails.root.join('config', 'dropbox.yml'))[Rails.env]
    dir = Rails.root.join('tmp', 'db_dumps')
    Dir.mkdir(dir) unless Dir.exist?(dir)
    @file_dir = dir + @backup_obj.filename
  end

  def create_backup!
    puts 'Running PG Backup Command'
    cmd_status = system(pg_dump_cmd)
    cmd_status ? upload_file_on_dropbox : error_on_creating
    puts 'End of the PG Backup Command'
  end

  def pg_dump_cmd
    passwrd = ENV['CABLEMAN_DATABASE_PASSWORD'] || @db_config['password']
    "PGPASSWORD=#{passwrd} pg_dump -U #{@db_config['username']} -h localhost -p 5432 #{@db_config['database']} > #{@file_dir}"
  end

  def upload_file_on_dropbox
    file = File.open(@file_dir)
    response = HTTParty.post(DROPBOX_UPLOAD_URL,
                             body: file.read, headers: { "Content-Type": 'application/octet-stream',
                                                         "Authorization": "Bearer #{@dropbox_config['dropbox_token']}",
                                                         "Dropbox-API-Arg": data_params.to_json })
    response.code == 200 ? on_success(file) : on_error(file, response)
  end

  def data_params
    {
      "path": "/#{Rails.env}_backups/#{@backup_obj.filename}",
      "mode": 'add',
      "autorename": true,
      "mute": false,
      "strict_conflict": false
    }
  end

  def on_success(file)
    File.delete(file.path)
    @backup_obj.finished!
  end

  def on_error(file, res)
    if res.code == 400
      @backup_obj.failed_with_info("Dropbox:"+res.body)
    else
      @backup_obj.failed_with_info("Dropbox:"+JSON.parse(res.body)['error_summary'])
    end
    File.delete(file.path)
  end

  def error_on_creating
    @backup_obj.failed_with_info('Error in creating pg dump file.')
  end
end
