# frozen_string_literal: true

class UpdateBoxTextService

  def initialize(line)
    @job = line.job
    @line = line
    @file = @job.plans.find_by_id(@job.selected_plan)&.blob
    dir = Rails.root.join('tmp', 'plan_svgs')
    Dir.mkdir(dir) unless Dir.exist?(dir)
    @actual_filename = @file&.filename.to_s
    @filename = dir + "#{@actual_filename}_#{DateTime.now.strftime('%Q')}"
  end

  def update_svg!
    return if @file.nil?

    File.open(@filename, 'wb') do |file|
      file.write(@file.download)
    end
    open_file
    File.delete(@filename) rescue Rails.logger.debug "Can not be remove svg file. #{@filename}"
  end

  def open_file
    original = File.read(@filename)
    document = Nokogiri::XML.parse(original)
    texts = document.css('text')
    return unless texts.present?

    text = find_text(texts)
    return unless text.present?

    text.content = @line.cable_text

    File.open(@filename, "w") do |f|
      f.write(document.to_xml)
    end

    ActiveRecord::Base.transaction do
      plan = @job.plans.find_by_id(@job.selected_plan)
      if plan.purge
        @job.plans.attach(io: File.open(@filename), filename: @actual_filename)
        @job.update(selected_plan: @job.plans.last.blob.id)
      end
    end
  end

  def find_text(texts)
    if @line.previous_changes[:cable_text].present?
      texts.find {|text| text.children[0].text == @line.previous_changes[:cable_text][0] }
    end
  end
end
