import NewComputationProto from "@/IERT/js/windows/computationWindows";

export default {
  name: "funcProvider",

  methods: {
    NewComputation : function () {
      return new NewComputationProto();
    },

    NewChess : function () {
      return new NewChessProto();
    },

    NewAddChess : function () {
      return new NewAddChessProto();
    },

    NewUnityControlWindows : function () {
      return new NewUnityControlWindowsProto();
    },

    NewLoadChessToServer : function () {
      return new NewLoadChessToServerProvider();
    },
  }
}
