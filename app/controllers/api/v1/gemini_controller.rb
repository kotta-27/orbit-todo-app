require "net/http"

class Api::V1::GeminiController < ApplicationController
  def create
    prompt = params[:prompt]
    api_key = ENV["GEMINI_API_KEY"] # .envやcredentialsで管理

    uri = URI("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=#{api_key}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    req = Net::HTTP::Post.new(uri.path + "?" + uri.query, { "Content-Type" => "application/json" })
    req.body = {
      contents: [
        {
          parts: [
            { text: prompt },
          ],
        },
      ],
    }.to_json

    res = http.request(req)
    puts "Gemini API response: #{res.body}"
    render json: JSON.parse(res.body)
  end
end
