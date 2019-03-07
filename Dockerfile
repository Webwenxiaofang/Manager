FROM nginx
#RUN mkdir /usr/share/nginx/nnui
#RUN mkdir /usr/share/nginx/nnui/build
RUN rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./ /usr/share/nginx/html
EXPOSE 80