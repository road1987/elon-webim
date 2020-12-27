package com.elon.webim;

import java.util.Map;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

public class HttpHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {
        // 将 request 对象转换为 ServletServerHttpRequest 对象
        ServletServerHttpRequest serverRequest = (ServletServerHttpRequest) request;
        String userName = serverRequest.getServletRequest().getParameter("user");
        User user = new User();
        user.setUsername(userName);
        attributes.put("user", user);
        System.out.println(((User) attributes.get("user")).getUsername());
        if (null != attributes.get("user")) {
            return true;
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        // TODO Auto-generated method stub

    }

}
