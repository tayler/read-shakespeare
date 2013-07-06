#!/usr/bin/env ruby
require 'rubygems'
require 'sinatra'
require 'rest_client'
require 'json'

# http://www.slideshare.net/timanglade/couchdb-ruby-youre-doing-it-wrong slide 24
# https://github.com/rest-client/rest-client
# http://japhr.blogspot.com/2009/03/spike-sinatra-and-couchdb.html
DB = "http://127.0.0.1:5984/words"

# examples
# http://stackoverflow.com/questions/2997213/send-and-receive-json-using-restclient-and-sinatra
# https://github.com/rest-client/rest-client --
# RestClient.post 'http://example.com/resource', :param1 => 'one', :nested => { :param2 => 'two' }
# RestClient.post "http://example.com/resource", { 'x' => 1 }.to_json, :content_type => :json, :accept => :json
post '/save_results' do
    puts "#{params[:wordsString]}"
    puts "#{params[:duration]}"
    puts "#{params[:linesCount]}"
    puts "#{params[:wordCount]}"

    response = RestClient.post '#{DB}' {:data => params}

    puts "#{response}"
end