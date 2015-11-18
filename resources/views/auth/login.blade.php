@extends('app')

@section('content')
<div class="container-fluid">
	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<div class="panel panel-success">
			  <div class="panel-heading">Login</div>
			  <div class="panel-body">
					@include('partials.loginform')
				</div>
			</div>

			@include('partials.adloginform')
		</div>
	</div>
</div>
@endsection
