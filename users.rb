# frozen_string_literal: true

module API
  module V1
    class Users < API::V1::Base
      include API::Defaults

      resource :users do
        desc 'Signup user', {
          headers: {
            'Authorization' => {
              description: Constant::AUTH_DESCRIPTION,
              required: true
            }
          }
        }
        params do
          requires :user, type: Hash, desc: 'User object' do
            requires :first_name, type: String, desc: 'First Name'
            requires :last_name, type: String, desc: 'Last Name'
            requires :username, type: String, desc: 'Username'
            requires :password, type: String, desc: 'Password'
            requires :password_confirmation, type: String, desc: 'Password Confirmation'
          end
        end
        post do
          user = User.new(params[:user])
          if user.save
            access_token = user.get_access_token
            response_body = {"access_token": access_token.token}.merge(user.attributes)
            respond(200, response_body.as_json)
          else
            error!({status: 403, error: error_message(user)}, 200)
          end
        end

        desc "Login for user."
        params do
          requires :username, type: String, desc: "Login ", allow_blank: false
          requires :password, type: String, desc: "Password", allow_blank: false
          requires :firebase_token, type: String, desc: 'Registration Token', allow_blank: false
        end
        post :login do
          user = User.find_by_username(params[:username].downcase)
          if user&.valid_password?(params[:password])
            access_token = user.get_access_token
            AppToken.create(registration_token: params[:firebase_token])
            response_body = {"access_token": access_token.token}.merge(user.attributes)
            respond(200, response_body.as_json)
          else
            error!({status: 403, error: 'Invalid Username or Password.'}, 200)
          end
        end

        desc "Logout user"
        params do
          use :authentication_params
        end
        post :logout do
          authenticate!
          if @access_token.present?
            @access_token.destroy
            AppToken.last.destroy
          end
          respond(200, {notice: 'Logout Successfully'})
        end
      end
    end
  end
end
